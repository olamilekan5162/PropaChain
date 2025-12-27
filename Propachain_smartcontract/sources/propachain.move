module propachain::propachain {
    use std::string::{Self, String};
    use std::option::{Self, Option};
    use std::signer;
    use std::vector;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;
    use aptos_framework::timestamp;

    use aptos_std::table::{Self, Table};
    use aptos_std::simple_map::{Self, SimpleMap};

    // ==================== Error Codes ====================
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_INVALID_AMOUNT: u64 = 2;
    const E_PROPERTY_NOT_AVAILABLE: u64 = 3;
    const E_ALREADY_CONFIRMED: u64 = 4;
    const E_ALREADY_RESOLVED: u64 = 5;
    const E_NO_DISPUTE: u64 = 6;
    const E_RENTAL_NOT_EXPIRED: u64 = 7;
    const E_INVALID_LISTING_TYPE: u64 = 8;
    const E_ESCROW_NOT_CONFIRMED: u64 = 9;
    const E_DISPUTE_RAISED: u64 = 10;
    const E_PROFILE_NOT_FOUND: u64 = 11;
    const E_NOT_IN_ESCROW: u64 = 12;
    const E_RECEIPT_NOT_FOUND: u64 = 13;

    // ==================== Listing Type Constants ====================
    const LISTING_TYPE_SALE: u8 = 1;
    const LISTING_TYPE_RENT: u8 = 2;

    // ==================== Status Constants ====================
    const STATUS_AVAILABLE: u8 = 1;
    const STATUS_IN_ESCROW: u8 = 2;
    const STATUS_COMPLETED: u8 = 3;
    const STATUS_RENTED: u8 = 4;

    // ==================== Structs ====================

    /// Platform Admin Capability - Only for dispute resolution
    struct AdminCap has key {
        admin_address: address,
    }

    /// Global Registry to store user profiles
    struct ProfileRegistry has key {
        profiles: Table<address, UserProfile>,
    }

    /// User Profile with KYC details (stored in registry)
    struct UserProfile has store, drop, copy {
        wallet_address: address,
        full_name: String,
        government_id_type: String,
        government_id_number: String,
        phone_number: String,
        email: String,
        created_at: u64,
    }

    /// Property Listings Storage
    struct PropertyListingsStore has key {
        listings: SimpleMap<u64, PropertyListing>,
        next_id: u64,
    }

    /// Unified Property Listing (for both Sale and Rent)
    struct PropertyListing has store, drop, copy {
        id: u64,
        owner: address,
        listing_type: u8, // 1 = Sale, 2 = Rent
        
        // Pricing
        price: u64, // Sale price OR total rental amount (monthly_rent * months + deposit)
        monthly_rent: Option<u64>, // Only for rent
        rental_period_months: Option<u64>, // Only for rent
        deposit_required: Option<u64>, // Only for rent
        
        // Property Details
        property_address: String,
        property_type: String,
        description: String,
        
        // Media (IPFS Content IDs)
        documents_cid: Option<String>, // Only for sale
        images_cids: vector<String>,
        video_cid: String,
        
        // Status
        status: u8,
        locked_by: Option<address>,
        escrow_id: Option<u64>,
        created_at: u64,
        
        // Rental specific
        rental_start_date: Option<u64>,
        rental_end_date: Option<u64>,
    }

    /// Escrow Storage
    struct EscrowStore has key {
        escrows: SimpleMap<u64, Escrow>,
        next_id: u64,
    }

    /// Escrow for both Buy and Rent transactions
    struct Escrow has store, drop, copy {
        id: u64,
        listing_type: u8,
        property_id: u64,
        
        // Parties
        buyer_renter: address,
        seller_landlord: address,
        
        // Payment
        amount: u64,
        
        // Confirmations
        buyer_renter_confirmed: bool,
        seller_landlord_confirmed: bool,
        
        // Dispute
        dispute_raised: bool,
        dispute_raised_by: Option<address>,
        dispute_reason: String,
        
        // Receipt NFTs
        buyer_renter_receipt_id: Option<u64>,
        seller_landlord_receipt_id: Option<u64>,
        
        // Status
        resolved: bool,
        created_at: u64,
    }

    /// Escrow Funds Storage (separate from Escrow data)
    struct EscrowFunds has key {
        funds: SimpleMap<u64, Coin<AptosCoin>>,
    }

    /// Receipt Storage
    struct ReceiptStore has key {
        receipts: SimpleMap<u64, PropertyReceipt>,
        next_id: u64,
    }

    /// Property Receipt NFT
    struct PropertyReceipt has store, drop, copy {
        id: u64,
        listing_type: u8,
        timestamp: u64,
        
        // Property Info
        property_id: u64,
        property_address: String,
        property_type: String,
        
        // Parties
        buyer_renter_address: address,
        seller_landlord_address: address,
        
        // Payment
        amount_paid: u64,
        
        // For Rent Only
        rental_start_date: Option<u64>,
        rental_end_date: Option<u64>,
        rental_period_months: Option<u64>,
        monthly_rent: Option<u64>,
        
        // Metadata
        metadata_uri: String,
    }

    /// User Receipt Ownership Tracking
    struct UserReceipts has key {
        receipt_ids: vector<u64>,
    }

    // ==================== Events ====================

    #[event]
    struct UserRegistered has drop, store {
        user_address: address,
        full_name: String,
        government_id_type: String,
        phone_number: String,
        email: String,
        timestamp: u64,
    }

    #[event]
    struct PropertyListed has drop, store {
        property_id: u64,
        owner: address,
        listing_type: u8,
        price: u64,
        property_address: String,
        timestamp: u64,
    }

    #[event]
    struct EscrowCreated has drop, store {
        escrow_id: u64,
        property_id: u64,
        listing_type: u8,
        buyer_renter: address,
        seller_landlord: address,
        amount: u64,
        timestamp: u64,
    }

    #[event]
    struct PartyConfirmed has drop, store {
        escrow_id: u64,
        confirmer: address,
        is_buyer_renter: bool,
        timestamp: u64,
    }

    #[event]
    struct FundsReleased has drop, store {
        escrow_id: u64,
        property_id: u64,
        receiver: address,
        amount: u64,
        timestamp: u64,
    }

    #[event]
    struct DisputeRaised has drop, store {
        escrow_id: u64,
        raised_by: address,
        reason: String,
        timestamp: u64,
    }

    #[event]
    struct DisputeResolved has drop, store {
        escrow_id: u64,
        winner: address,
        amount: u64,
        receipts_deleted: bool,
        timestamp: u64,
    }

    #[event]
    struct ReceiptMinted has drop, store {
        receipt_id: u64,
        recipient: address,
        listing_type: u8,
        amount: u64,
        timestamp: u64,
    }

    #[event]
    struct RentalExpired has drop, store {
        property_id: u64,
        renter: address,
        landlord: address,
        timestamp: u64,
    }

    // ==================== Init Function ====================

    fun init_module(account: &signer) {
        let account_addr = signer::address_of(account);
        
        // Initialize admin capability
        move_to(account, AdminCap {
            admin_address: account_addr,
        });
        
        // Initialize profile registry
        move_to(account, ProfileRegistry {
            profiles: table::new(),
        });

        // Initialize property listings store
        move_to(account, PropertyListingsStore {
            listings: simple_map::create(),
            next_id: 1,
        });

        // Initialize escrow store
        move_to(account, EscrowStore {
            escrows: simple_map::create(),
            next_id: 1,
        });

        // Initialize escrow funds storage
        move_to(account, EscrowFunds {
            funds: simple_map::create(),
        });

        // Initialize receipt store
        move_to(account, ReceiptStore {
            receipts: simple_map::create(),
            next_id: 1,
        });
    }

    // ==================== User Management Functions ====================

    public entry fun register_user(
        account: &signer,
        registry_addr: address,
        full_name: String,
        government_id_type: String,
        government_id_number: String,
        phone_number: String,
        email: String,
    ) acquires ProfileRegistry {
        let user_address = signer::address_of(account);
        let registry = borrow_global_mut<ProfileRegistry>(registry_addr);
        
        let profile = UserProfile {
            wallet_address: user_address,
            full_name,
            government_id_type,
            government_id_number,
            phone_number,
            email,
            created_at: timestamp::now_seconds(),
        };

        event::emit(UserRegistered {
            user_address,
            full_name: profile.full_name,
            government_id_type: profile.government_id_type,
            phone_number: profile.phone_number,
            email: profile.email,
            timestamp: profile.created_at,
        });

        table::add(&mut registry.profiles, user_address, profile);

        // Initialize user receipts if not exists
        if (!exists<UserReceipts>(user_address)) {
            move_to(account, UserReceipts {
                receipt_ids: vector::empty(),
            });
        };
    }

    // ==================== Property Listing Functions ====================

    public entry fun list_property(
        account: &signer,
        store_addr: address,
        listing_type: u8,
        price: u64,
        property_address: String,
        property_type: String,
        description: String,
        images_cids: vector<String>,
        video_cid: String,
        // Optional fields for sale
        documents_cid: Option<String>,
        // Optional fields for rent
        monthly_rent: Option<u64>,
        rental_period_months: Option<u64>,
        deposit_required: Option<u64>,
    ) acquires PropertyListingsStore {
        assert!(listing_type == LISTING_TYPE_SALE || listing_type == LISTING_TYPE_RENT, E_INVALID_LISTING_TYPE);

        let store = borrow_global_mut<PropertyListingsStore>(store_addr);
        let property_id = store.next_id;
        store.next_id = store.next_id + 1;

        let listing = PropertyListing {
            id: property_id,
            owner: signer::address_of(account),
            listing_type,
            price,
            monthly_rent,
            rental_period_months,
            deposit_required,
            property_address,
            property_type,
            description,
            documents_cid,
            images_cids,
            video_cid,
            status: STATUS_AVAILABLE,
            locked_by: option::none(),
            escrow_id: option::none(),
            created_at: timestamp::now_seconds(),
            rental_start_date: option::none(),
            rental_end_date: option::none(),
        };

        event::emit(PropertyListed {
            property_id,
            owner: listing.owner,
            listing_type,
            price,
            property_address: listing.property_address,
            timestamp: listing.created_at,
        });

        simple_map::add(&mut store.listings, property_id, listing);
    }

    // ==================== Escrow Functions ====================

    public entry fun deposit_to_escrow(
        account: &signer,
        store_addr: address,
        escrow_store_addr: address,
        receipt_store_addr: address,
        property_id: u64,
        payment_amount: u64,
        metadata_uri: String,
    ) acquires PropertyListingsStore, EscrowStore, EscrowFunds, ReceiptStore, UserReceipts {
        let buyer_renter = signer::address_of(account);
        
        let property_store = borrow_global_mut<PropertyListingsStore>(store_addr);
        let property = simple_map::borrow_mut(&mut property_store.listings, &property_id);
        
        assert!(property.status == STATUS_AVAILABLE, E_PROPERTY_NOT_AVAILABLE);
        assert!(buyer_renter != property.owner, E_NOT_AUTHORIZED);
        assert!(payment_amount >= property.price, E_INVALID_AMOUNT);

        // Register for AptosCoin if not already registered
        if (!coin::is_account_registered<AptosCoin>(buyer_renter)) {
            coin::register<AptosCoin>(account);
        };

        // Withdraw payment from buyer
        let payment = coin::withdraw<AptosCoin>(account, payment_amount);

        property.status = STATUS_IN_ESCROW;
        property.locked_by = option::some(buyer_renter);

        // Create escrow
        let escrow_store = borrow_global_mut<EscrowStore>(escrow_store_addr);
        let escrow_id = escrow_store.next_id;
        escrow_store.next_id = escrow_store.next_id + 1;

        let current_time = timestamp::now_seconds();

        // Create receipts for both parties
        let (buyer_receipt_id, seller_receipt_id) = create_receipts(
            receipt_store_addr,
            property.listing_type,
            property_id,
            property.property_address,
            property.property_type,
            buyer_renter,
            property.owner,
            payment_amount,
            option::none(),
            option::none(),
            property.rental_period_months,
            property.monthly_rent,
            metadata_uri,
            current_time,
        );

        // Track receipts for users
        track_user_receipt(buyer_renter, buyer_receipt_id);
        track_user_receipt(property.owner, seller_receipt_id);

        let escrow = Escrow {
            id: escrow_id,
            listing_type: property.listing_type,
            property_id,
            buyer_renter,
            seller_landlord: property.owner,
            amount: payment_amount,
            buyer_renter_confirmed: false,
            seller_landlord_confirmed: false,
            dispute_raised: false,
            dispute_raised_by: option::none(),
            dispute_reason: string::utf8(b""),
            buyer_renter_receipt_id: option::some(buyer_receipt_id),
            seller_landlord_receipt_id: option::some(seller_receipt_id),
            resolved: false,
            created_at: current_time,
        };

        property.escrow_id = option::some(escrow_id);

        // Store payment in EscrowFunds
        let escrow_funds = borrow_global_mut<EscrowFunds>(escrow_store_addr);
        simple_map::add(&mut escrow_funds.funds, escrow_id, payment);

        event::emit(EscrowCreated {
            escrow_id,
            property_id,
            listing_type: property.listing_type,
            buyer_renter,
            seller_landlord: property.owner,
            amount: payment_amount,
            timestamp: escrow.created_at,
        });

        simple_map::add(&mut escrow_store.escrows, escrow_id, escrow);
    }

    public entry fun buyer_renter_confirms(
        account: &signer,
        escrow_store_addr: address,
        property_store_addr: address,
        escrow_id: u64,
    ) acquires EscrowStore, PropertyListingsStore, EscrowFunds, ReceiptStore {
        let caller = signer::address_of(account);
        
        let escrow_store = borrow_global_mut<EscrowStore>(escrow_store_addr);
        let escrow = simple_map::borrow_mut(&mut escrow_store.escrows, &escrow_id);
        
        assert!(escrow.buyer_renter == caller, E_NOT_AUTHORIZED);
        assert!(!escrow.resolved, E_ALREADY_RESOLVED);
        assert!(!escrow.buyer_renter_confirmed, E_ALREADY_CONFIRMED);
        assert!(!escrow.dispute_raised, E_DISPUTE_RAISED);

        escrow.buyer_renter_confirmed = true;

        event::emit(PartyConfirmed {
            escrow_id,
            confirmer: caller,
            is_buyer_renter: true,
            timestamp: timestamp::now_seconds(),
        });

        if (escrow.seller_landlord_confirmed) {
            release_funds_no_receipts(escrow_store_addr, property_store_addr, escrow_id);
        };
    }

    public entry fun seller_landlord_confirms(
        account: &signer,
        escrow_store_addr: address,
        property_store_addr: address,
        escrow_id: u64,
    ) acquires EscrowStore, PropertyListingsStore, EscrowFunds, ReceiptStore {
        let caller = signer::address_of(account);
        
        let escrow_store = borrow_global_mut<EscrowStore>(escrow_store_addr);
        let escrow = simple_map::borrow_mut(&mut escrow_store.escrows, &escrow_id);
        
        assert!(escrow.seller_landlord == caller, E_NOT_AUTHORIZED);
        assert!(!escrow.resolved, E_ALREADY_RESOLVED);
        assert!(!escrow.seller_landlord_confirmed, E_ALREADY_CONFIRMED);
        assert!(!escrow.dispute_raised, E_DISPUTE_RAISED);

        escrow.seller_landlord_confirmed = true;

        event::emit(PartyConfirmed {
            escrow_id,
            confirmer: caller,
            is_buyer_renter: false,
            timestamp: timestamp::now_seconds(),
        });

        if (escrow.buyer_renter_confirmed) {
            release_funds_no_receipts(escrow_store_addr, property_store_addr, escrow_id);
        };
    }

    fun release_funds_no_receipts(
        escrow_store_addr: address,
        property_store_addr: address,
        escrow_id: u64,
    ) acquires EscrowStore, PropertyListingsStore, EscrowFunds, ReceiptStore {
        let escrow_store = borrow_global_mut<EscrowStore>(escrow_store_addr);
        let escrow = simple_map::borrow_mut(&mut escrow_store.escrows, &escrow_id);
        
        assert!(!escrow.resolved, E_ALREADY_RESOLVED);
        assert!(escrow.buyer_renter_confirmed && escrow.seller_landlord_confirmed, E_ESCROW_NOT_CONFIRMED);

        // Register seller for AptosCoin if needed
        if (!coin::is_account_registered<AptosCoin>(escrow.seller_landlord)) {
            abort E_NOT_AUTHORIZED
        };

        // Extract payment and transfer to seller
        let escrow_funds = borrow_global_mut<EscrowFunds>(escrow_store_addr);
        let (_, payment) = simple_map::remove(&mut escrow_funds.funds, &escrow_id);
        let amount = coin::value(&payment);
        
        coin::deposit(escrow.seller_landlord, payment);

        let current_time = timestamp::now_seconds();

        // Update property status and rental dates if applicable
        let property_store = borrow_global_mut<PropertyListingsStore>(property_store_addr);
        let property = simple_map::borrow_mut(&mut property_store.listings, &escrow.property_id);

        // Capture receipt IDs and listing type before borrowing ends
        let buyer_receipt_id_opt = escrow.buyer_renter_receipt_id;
        let seller_receipt_id_opt = escrow.seller_landlord_receipt_id;
        let listing_type = escrow.listing_type;

        if (listing_type == LISTING_TYPE_RENT) {
            let seconds_in_month: u64 = 30 * 24 * 60 * 60;
            let rental_period = *option::borrow(&property.rental_period_months);
            let rental_duration = rental_period * seconds_in_month;
            
            let start_date = current_time;
            let end_date = current_time + rental_duration;
            
            property.rental_start_date = option::some(start_date);
            property.rental_end_date = option::some(end_date);
            property.status = STATUS_RENTED;

            // Update receipts with rental dates - do this after we're done with escrow borrow
            escrow.resolved = true;
            
            // Now update receipts (this will borrow ReceiptStore, not EscrowStore)
            if (option::is_some(&buyer_receipt_id_opt)) {
                let buyer_receipt_id = *option::borrow(&buyer_receipt_id_opt);
                let receipt_store = borrow_global_mut<ReceiptStore>(escrow_store_addr);
                let buyer_receipt = simple_map::borrow_mut(&mut receipt_store.receipts, &buyer_receipt_id);
                buyer_receipt.rental_start_date = option::some(start_date);
                buyer_receipt.rental_end_date = option::some(end_date);
            };

            if (option::is_some(&seller_receipt_id_opt)) {
                let seller_receipt_id = *option::borrow(&seller_receipt_id_opt);
                let receipt_store = borrow_global_mut<ReceiptStore>(escrow_store_addr);
                let seller_receipt = simple_map::borrow_mut(&mut receipt_store.receipts, &seller_receipt_id);
                seller_receipt.rental_start_date = option::some(start_date);
                seller_receipt.rental_end_date = option::some(end_date);
            };
        } else {
            property.status = STATUS_COMPLETED;
            escrow.resolved = true;
        };

        property.locked_by = option::none();
        property.escrow_id = option::none();

        event::emit(FundsReleased {
            escrow_id,
            property_id: escrow.property_id,
            receiver: escrow.seller_landlord,
            amount,
            timestamp: current_time,
        });
    }

    // ==================== Rental Expiration ====================

    public entry fun check_rental_expiration(
        property_store_addr: address,
        property_id: u64,
    ) acquires PropertyListingsStore {
        let property_store = borrow_global_mut<PropertyListingsStore>(property_store_addr);
        let property = simple_map::borrow_mut(&mut property_store.listings, &property_id);
        
        assert!(property.listing_type == LISTING_TYPE_RENT, E_INVALID_LISTING_TYPE);
        assert!(property.status == STATUS_RENTED, E_NOT_IN_ESCROW);
        
        let end_date = *option::borrow(&property.rental_end_date);
        let current_time = timestamp::now_seconds();
        
        assert!(current_time >= end_date, E_RENTAL_NOT_EXPIRED);

        let renter = *option::borrow(&property.locked_by);
        
        property.status = STATUS_AVAILABLE;
        property.locked_by = option::none();
        property.rental_start_date = option::none();
        property.rental_end_date = option::none();

        event::emit(RentalExpired {
            property_id,
            renter,
            landlord: property.owner,
            timestamp: current_time,
        });
    }

    // ==================== Dispute Functions ====================

    public entry fun raise_dispute(
        account: &signer,
        escrow_store_addr: address,
        escrow_id: u64,
        reason: String,
    ) acquires EscrowStore {
        let caller = signer::address_of(account);
        
        let escrow_store = borrow_global_mut<EscrowStore>(escrow_store_addr);
        let escrow = simple_map::borrow_mut(&mut escrow_store.escrows, &escrow_id);
        
        assert!(caller == escrow.buyer_renter || caller == escrow.seller_landlord, E_NOT_AUTHORIZED);
        assert!(!escrow.resolved, E_ALREADY_RESOLVED);
        assert!(!escrow.dispute_raised, E_ALREADY_CONFIRMED);

        escrow.dispute_raised = true;
        escrow.dispute_raised_by = option::some(caller);
        escrow.dispute_reason = reason;

        event::emit(DisputeRaised {
            escrow_id,
            raised_by: caller,
            reason: escrow.dispute_reason,
            timestamp: timestamp::now_seconds(),
        });
    }

    public entry fun admin_resolve_dispute_release(
        account: &signer,
        admin_addr: address,
        escrow_store_addr: address,
        property_store_addr: address,
        escrow_id: u64,
    ) acquires AdminCap, EscrowStore, PropertyListingsStore, EscrowFunds, ReceiptStore {
        // Verify admin
        let admin_cap = borrow_global<AdminCap>(admin_addr);
        assert!(signer::address_of(account) == admin_cap.admin_address, E_NOT_AUTHORIZED);

        let escrow_store = borrow_global_mut<EscrowStore>(escrow_store_addr);
        let escrow = simple_map::borrow_mut(&mut escrow_store.escrows, &escrow_id);
        
        assert!(!escrow.resolved, E_ALREADY_RESOLVED);
        assert!(escrow.dispute_raised, E_NO_DISPUTE);

        // Register seller for AptosCoin if needed
        if (!coin::is_account_registered<AptosCoin>(escrow.seller_landlord)) {
            abort E_NOT_AUTHORIZED
        };

        // Extract and transfer payment
        let escrow_funds = borrow_global_mut<EscrowFunds>(escrow_store_addr);
        let (_, payment) = simple_map::remove(&mut escrow_funds.funds, &escrow_id);
        let amount = coin::value(&payment);
        
        coin::deposit(escrow.seller_landlord, payment);

        let current_time = timestamp::now_seconds();

        // Update property
        let property_store = borrow_global_mut<PropertyListingsStore>(property_store_addr);
        let property = simple_map::borrow_mut(&mut property_store.listings, &escrow.property_id);

        // Capture receipt IDs and listing type before borrowing ends
        let buyer_receipt_id_opt = escrow.buyer_renter_receipt_id;
        let seller_receipt_id_opt = escrow.seller_landlord_receipt_id;
        let listing_type = escrow.listing_type;

        if (listing_type == LISTING_TYPE_RENT) {
            let seconds_in_month: u64 = 30 * 24 * 60 * 60;
            let rental_period = *option::borrow(&property.rental_period_months);
            let rental_duration = rental_period * seconds_in_month;
            
            let start_date = current_time;
            let end_date = current_time + rental_duration;
            
            property.rental_start_date = option::some(start_date);
            property.rental_end_date = option::some(end_date);
            property.status = STATUS_RENTED;

            // Update receipts with rental dates - do this after we're done with escrow borrow
            escrow.resolved = true;
            
            // Now update receipts (this will borrow ReceiptStore, not EscrowStore)
            if (option::is_some(&buyer_receipt_id_opt)) {
                let buyer_receipt_id = *option::borrow(&buyer_receipt_id_opt);
                let receipt_store = borrow_global_mut<ReceiptStore>(escrow_store_addr);
                let buyer_receipt = simple_map::borrow_mut(&mut receipt_store.receipts, &buyer_receipt_id);
                buyer_receipt.rental_start_date = option::some(start_date);
                buyer_receipt.rental_end_date = option::some(end_date);
            };

            if (option::is_some(&seller_receipt_id_opt)) {
                let seller_receipt_id = *option::borrow(&seller_receipt_id_opt);
                let receipt_store = borrow_global_mut<ReceiptStore>(escrow_store_addr);
                let seller_receipt = simple_map::borrow_mut(&mut receipt_store.receipts, &seller_receipt_id);
                seller_receipt.rental_start_date = option::some(start_date);
                seller_receipt.rental_end_date = option::some(end_date);
            };
        } else {
            property.status = STATUS_COMPLETED;
            escrow.resolved = true;
        };

        property.locked_by = option::none();
        property.escrow_id = option::none();

        event::emit(DisputeResolved {
            escrow_id,
            winner: escrow.seller_landlord,
            amount,
            receipts_deleted: false,
            timestamp: current_time,
        });
    }

    public entry fun admin_resolve_dispute_refund(
        account: &signer,
        admin_addr: address,
        escrow_store_addr: address,
        property_store_addr: address,
        receipt_store_addr: address,
        escrow_id: u64,
    ) acquires AdminCap, EscrowStore, PropertyListingsStore, EscrowFunds, ReceiptStore, UserReceipts {
        // Verify admin
        let admin_cap = borrow_global<AdminCap>(admin_addr);
        assert!(signer::address_of(account) == admin_cap.admin_address, E_NOT_AUTHORIZED);

        let escrow_store = borrow_global_mut<EscrowStore>(escrow_store_addr);
        let escrow = simple_map::borrow_mut(&mut escrow_store.escrows, &escrow_id);
        
        assert!(!escrow.resolved, E_ALREADY_RESOLVED);
        assert!(escrow.dispute_raised, E_NO_DISPUTE);

        // Extract and refund payment
        let escrow_funds = borrow_global_mut<EscrowFunds>(escrow_store_addr);
        let (_, refund) = simple_map::remove(&mut escrow_funds.funds, &escrow_id);
        let amount = coin::value(&refund);
        
        coin::deposit(escrow.buyer_renter, refund);

        // Delete receipts
        let buyer_receipt_id = *option::borrow(&escrow.buyer_renter_receipt_id);
        let seller_receipt_id = *option::borrow(&escrow.seller_landlord_receipt_id);
        
        delete_receipt(receipt_store_addr, buyer_receipt_id);
        delete_receipt(receipt_store_addr, seller_receipt_id);

        // Remove from user tracking
        remove_user_receipt(escrow.buyer_renter, buyer_receipt_id);
        remove_user_receipt(escrow.seller_landlord, seller_receipt_id);

        // Update property
        let property_store = borrow_global_mut<PropertyListingsStore>(property_store_addr);
        let property = simple_map::borrow_mut(&mut property_store.listings, &escrow.property_id);

        property.status = STATUS_AVAILABLE;
        property.locked_by = option::none();
        property.escrow_id = option::none();

        escrow.resolved = true;

        event::emit(DisputeResolved {
            escrow_id,
            winner: escrow.buyer_renter,
            amount,
            receipts_deleted: true,
            timestamp: timestamp::now_seconds(),
        });
    }

    // ==================== Helper Functions ====================

    fun create_receipts(
        receipt_store_addr: address,
        listing_type: u8,
        property_id: u64,
        property_address: String,
        property_type: String,
        buyer_renter: address,
        seller_landlord: address,
        amount_paid: u64,
        rental_start_date: Option<u64>,
        rental_end_date: Option<u64>,
        rental_period_months: Option<u64>,
        monthly_rent: Option<u64>,
        metadata_uri: String,
        timestamp: u64,
    ): (u64, u64) acquires ReceiptStore {
        let receipt_store = borrow_global_mut<ReceiptStore>(receipt_store_addr);
        
        // Create buyer receipt
        let buyer_receipt_id = receipt_store.next_id;
        receipt_store.next_id = receipt_store.next_id + 1;
        
        let buyer_receipt = PropertyReceipt {
            id: buyer_receipt_id,
            listing_type,
            timestamp,
            property_id,
            property_address,
            property_type,
            buyer_renter_address: buyer_renter,
            seller_landlord_address: seller_landlord,
            amount_paid,
            rental_start_date,
            rental_end_date,
            rental_period_months,
            monthly_rent,
            metadata_uri,
        };

        simple_map::add(&mut receipt_store.receipts, buyer_receipt_id, buyer_receipt);

        event::emit(ReceiptMinted {
            receipt_id: buyer_receipt_id,
            recipient: buyer_renter,
            listing_type,
            amount: amount_paid,
            timestamp,
        });

        // Create seller receipt
        let seller_receipt_id = receipt_store.next_id;
        receipt_store.next_id = receipt_store.next_id + 1;
        
        let seller_receipt = PropertyReceipt {
            id: seller_receipt_id,
            listing_type,
            timestamp,
            property_id,
            property_address,
            property_type,
            buyer_renter_address: buyer_renter,
            seller_landlord_address: seller_landlord,
            amount_paid,
            rental_start_date,
            rental_end_date,
            rental_period_months,
            monthly_rent,
            metadata_uri,
        };

        simple_map::add(&mut receipt_store.receipts, seller_receipt_id, seller_receipt);

        event::emit(ReceiptMinted {
            receipt_id: seller_receipt_id,
            recipient: seller_landlord,
            listing_type,
            amount: amount_paid,
            timestamp,
        });

        (buyer_receipt_id, seller_receipt_id)
    }

    fun update_receipt_rental_dates(
        receipt_store_addr: address,
        buyer_receipt_id: Option<u64>,
        seller_receipt_id: Option<u64>,
        start_date: u64,
        end_date: u64,
    ) acquires ReceiptStore {
        if (option::is_some(&buyer_receipt_id)) {
            let receipt_id = *option::borrow(&buyer_receipt_id);
            let receipt_store = borrow_global_mut<ReceiptStore>(receipt_store_addr);
            let receipt = simple_map::borrow_mut(&mut receipt_store.receipts, &receipt_id);
            receipt.rental_start_date = option::some(start_date);
            receipt.rental_end_date = option::some(end_date);
        };

        if (option::is_some(&seller_receipt_id)) {
            let receipt_id = *option::borrow(&seller_receipt_id);
            let receipt_store = borrow_global_mut<ReceiptStore>(receipt_store_addr);
            let receipt = simple_map::borrow_mut(&mut receipt_store.receipts, &receipt_id);
            receipt.rental_start_date = option::some(start_date);
            receipt.rental_end_date = option::some(end_date);
        };
    }

    fun track_user_receipt(user_addr: address, receipt_id: u64) acquires UserReceipts {
        if (exists<UserReceipts>(user_addr)) {
            let user_receipts = borrow_global_mut<UserReceipts>(user_addr);
            vector::push_back(&mut user_receipts.receipt_ids, receipt_id);
        };
    }

    fun remove_user_receipt(user_addr: address, receipt_id: u64) acquires UserReceipts {
        if (exists<UserReceipts>(user_addr)) {
            let user_receipts = borrow_global_mut<UserReceipts>(user_addr);
            let (found, index) = vector::index_of(&user_receipts.receipt_ids, &receipt_id);
            if (found) {
                vector::remove(&mut user_receipts.receipt_ids, index);
            };
        };
    }

    fun delete_receipt(receipt_store_addr: address, receipt_id: u64) acquires ReceiptStore {
        let receipt_store = borrow_global_mut<ReceiptStore>(receipt_store_addr);
        if (simple_map::contains_key(&receipt_store.receipts, &receipt_id)) {
            simple_map::remove(&mut receipt_store.receipts, &receipt_id);
        };
    }

    // ==================== View/Getter Functions ====================

    #[view]
    public fun get_user_profile(registry_addr: address, user_address: address): UserProfile acquires ProfileRegistry {
        let registry = borrow_global<ProfileRegistry>(registry_addr);
        assert!(table::contains(&registry.profiles, user_address), E_PROFILE_NOT_FOUND);
        *table::borrow(&registry.profiles, user_address)
    }

    #[view]
    public fun has_profile(registry_addr: address, user_address: address): bool acquires ProfileRegistry {
        let registry = borrow_global<ProfileRegistry>(registry_addr);
        table::contains(&registry.profiles, user_address)
    }

    #[view]
    public fun get_property(store_addr: address, property_id: u64): PropertyListing acquires PropertyListingsStore {
        let store = borrow_global<PropertyListingsStore>(store_addr);
        *simple_map::borrow(&store.listings, &property_id)
    }

    #[view]
    public fun get_escrow(store_addr: address, escrow_id: u64): Escrow acquires EscrowStore {
        let store = borrow_global<EscrowStore>(store_addr);
        *simple_map::borrow(&store.escrows, &escrow_id)
    }

    #[view]
    public fun get_property_status(store_addr: address, property_id: u64): u8 acquires PropertyListingsStore {
        let store = borrow_global<PropertyListingsStore>(store_addr);
        let property = simple_map::borrow(&store.listings, &property_id);
        property.status
    }

    #[view]
    public fun get_property_listing_type(store_addr: address, property_id: u64): u8 acquires PropertyListingsStore {
        let store = borrow_global<PropertyListingsStore>(store_addr);
        let property = simple_map::borrow(&store.listings, &property_id);
        property.listing_type
    }

    #[view]
    public fun is_property_locked(store_addr: address, property_id: u64): bool acquires PropertyListingsStore {
        let store = borrow_global<PropertyListingsStore>(store_addr);
        let property = simple_map::borrow(&store.listings, &property_id);
        property.status == STATUS_IN_ESCROW
    }

    #[view]
    public fun get_escrow_amount(store_addr: address, escrow_id: u64): u64 acquires EscrowStore {
        let store = borrow_global<EscrowStore>(store_addr);
        let escrow = simple_map::borrow(&store.escrows, &escrow_id);
        escrow.amount
    }

    #[view]
    public fun is_escrow_resolved(store_addr: address, escrow_id: u64): bool acquires EscrowStore {
        let store = borrow_global<EscrowStore>(store_addr);
        let escrow = simple_map::borrow(&store.escrows, &escrow_id);
        escrow.resolved
    }

    #[view]
    public fun is_dispute_raised(store_addr: address, escrow_id: u64): bool acquires EscrowStore {
        let store = borrow_global<EscrowStore>(store_addr);
        let escrow = simple_map::borrow(&store.escrows, &escrow_id);
        escrow.dispute_raised
    }

    #[view]
    public fun get_confirmation_status(store_addr: address, escrow_id: u64): (bool, bool) acquires EscrowStore {
        let store = borrow_global<EscrowStore>(store_addr);
        let escrow = simple_map::borrow(&store.escrows, &escrow_id);
        (escrow.buyer_renter_confirmed, escrow.seller_landlord_confirmed)
    }

    #[view]
    public fun get_receipt(receipt_store_addr: address, receipt_id: u64): PropertyReceipt acquires ReceiptStore {
        let receipt_store = borrow_global<ReceiptStore>(receipt_store_addr);
        assert!(simple_map::contains_key(&receipt_store.receipts, &receipt_id), E_RECEIPT_NOT_FOUND);
        *simple_map::borrow(&receipt_store.receipts, &receipt_id)
    }

    #[view]
    public fun get_receipt_amount(receipt_store_addr: address, receipt_id: u64): u64 acquires ReceiptStore {
        let receipt_store = borrow_global<ReceiptStore>(receipt_store_addr);
        let receipt = simple_map::borrow(&receipt_store.receipts, &receipt_id);
        receipt.amount_paid
    }

    #[view]
    public fun get_user_receipts(user_addr: address): vector<u64> acquires UserReceipts {
        if (exists<UserReceipts>(user_addr)) {
            let user_receipts = borrow_global<UserReceipts>(user_addr);
            user_receipts.receipt_ids
        } else {
            vector::empty()
        }
    }

    #[view]
    public fun get_property_images(store_addr: address, property_id: u64): vector<String> acquires PropertyListingsStore {
        let store = borrow_global<PropertyListingsStore>(store_addr);
        let property = simple_map::borrow(&store.listings, &property_id);
        property.images_cids
    }

    #[view]
    public fun get_property_video(store_addr: address, property_id: u64): String acquires PropertyListingsStore {
        let store = borrow_global<PropertyListingsStore>(store_addr);
        let property = simple_map::borrow(&store.listings, &property_id);
        property.video_cid
    }

    #[view]
    public fun get_property_documents(store_addr: address, property_id: u64): Option<String> acquires PropertyListingsStore {
        let store = borrow_global<PropertyListingsStore>(store_addr);
        let property = simple_map::borrow(&store.listings, &property_id);
        property.documents_cid
    }

    #[view]
    public fun get_property_price(store_addr: address, property_id: u64): u64 acquires PropertyListingsStore {
        let store = borrow_global<PropertyListingsStore>(store_addr);
        let property = simple_map::borrow(&store.listings, &property_id);
        property.price
    }

    #[view]
    public fun get_property_owner(store_addr: address, property_id: u64): address acquires PropertyListingsStore {
        let store = borrow_global<PropertyListingsStore>(store_addr);
        let property = simple_map::borrow(&store.listings, &property_id);
        property.owner
    }

    #[view]
    public fun get_escrow_buyer_renter(store_addr: address, escrow_id: u64): address acquires EscrowStore {
        let store = borrow_global<EscrowStore>(store_addr);
        let escrow = simple_map::borrow(&store.escrows, &escrow_id);
        escrow.buyer_renter
    }

    #[view]
    public fun get_escrow_seller_landlord(store_addr: address, escrow_id: u64): address acquires EscrowStore {
        let store = borrow_global<EscrowStore>(store_addr);
        let escrow = simple_map::borrow(&store.escrows, &escrow_id);
        escrow.seller_landlord
    }

    #[view]
    public fun get_rental_dates(store_addr: address, property_id: u64): (Option<u64>, Option<u64>) acquires PropertyListingsStore {
        let store = borrow_global<PropertyListingsStore>(store_addr);
        let property = simple_map::borrow(&store.listings, &property_id);
        (property.rental_start_date, property.rental_end_date)
    }
}