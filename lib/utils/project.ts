/**
 * Calculates the time left until a deadline, considering the project status.
 * If the project is Delivered, Completed, or Cancelled, it returns a placeholder.
 */
export function getTimeLeft(deadline: string | Date, status?: string) {
  const s = status?.toLowerCase();
  if (s === "delivered" || s === "completed" || s === "cancelled") {
    return { 
      text: "Finished", 
      color: "text-white/20", 
      priority: "Green" 
    };
  }

  const now = new Date();
  const dl = new Date(deadline);
  const diff = dl.getTime() - now.getTime();

  if (diff <= 0) {
    return { 
      text: "Overdue", 
      color: "text-rose-500", 
      priority: "Red" 
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 3) {
    return { 
      text: `${days}d ${hours}h`, 
      color: "text-emerald-500", 
      priority: "Green" 
    };
  }
  
  if (days >= 1) {
    return { 
      text: `${days}d ${hours}h`, 
      color: "text-amber-500", 
      priority: "Yellow" 
    };
  }

  return { 
    text: `${hours}h`, 
    color: "text-rose-500", 
    priority: "Red" 
  };
}

/**
 * Calculates priority based on deadline.
 */
export function autoPriority(deadline: string | Date) {
  const now = new Date();
  const dl = new Date(deadline);
  const diff = dl.getTime() - now.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  
  if (days > 3) return "Green";
  if (days >= 1) return "Yellow";
  return "Red";
}
