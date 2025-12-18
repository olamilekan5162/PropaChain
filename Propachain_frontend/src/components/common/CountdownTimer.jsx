import { useState, useEffect } from 'react';

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

  const pad = (n) => n < 10 ? `0${n}` : n;

  return (
    <div className={`flex gap-4 ${className}`}>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold font-mono text-primary">{pad(timeLeft.days)}</span>
        <span className="text-xs text-slate-500 uppercase">Days</span>
      </div>
      <div className="text-2xl font-bold text-slate-300">:</div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold font-mono text-primary">{pad(timeLeft.hours)}</span>
        <span className="text-xs text-slate-500 uppercase">Hours</span>
      </div>
      <div className="text-2xl font-bold text-slate-300">:</div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold font-mono text-primary">{pad(timeLeft.minutes)}</span>
        <span className="text-xs text-slate-500 uppercase">Mins</span>
      </div>
      <div className="text-2xl font-bold text-slate-300">:</div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold font-mono text-primary">{pad(timeLeft.seconds)}</span>
        <span className="text-xs text-slate-500 uppercase">Secs</span>
      </div>
    </div>
  );
};
