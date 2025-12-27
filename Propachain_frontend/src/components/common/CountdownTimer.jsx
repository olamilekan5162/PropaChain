import { useState, useEffect } from "react";

export const CountdownTimer = ({ targetDate, className }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const pad = (n) => (n < 10 ? `0${n}` : n);

  return (
    <div className={`flex gap-3 ${className}`}>
      <div className="flex flex-col items-center bg-teal-50 rounded-lg px-3 py-2">
        <span className="text-2xl font-semibold font-mono text-teal-700">
          {pad(timeLeft.days)}
        </span>
        <span className="text-xs text-zinc-600 font-medium">Days</span>
      </div>
      <div className="text-2xl font-semibold text-zinc-300 self-center">:</div>
      <div className="flex flex-col items-center bg-teal-50 rounded-lg px-3 py-2">
        <span className="text-2xl font-semibold font-mono text-teal-700">
          {pad(timeLeft.hours)}
        </span>
        <span className="text-xs text-zinc-600 font-medium">Hrs</span>
      </div>
      <div className="text-2xl font-semibold text-zinc-300 self-center">:</div>
      <div className="flex flex-col items-center bg-teal-50 rounded-lg px-3 py-2">
        <span className="text-2xl font-semibold font-mono text-teal-700">
          {pad(timeLeft.minutes)}
        </span>
        <span className="text-xs text-zinc-600 font-medium">Mins</span>
      </div>
      <div className="text-2xl font-semibold text-zinc-300 self-center">:</div>
      <div className="flex flex-col items-center bg-teal-50 rounded-lg px-3 py-2">
        <span className="text-2xl font-semibold font-mono text-teal-700">
          {pad(timeLeft.seconds)}
        </span>
        <span className="text-xs text-zinc-600 font-medium">Secs</span>
      </div>
    </div>
  );
};
