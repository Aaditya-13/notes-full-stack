export const formatFullDate  = (date) => {

  return new Date(date).toLocaleString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }
  );

};

export const getLastUpdatedLabel = (dateString) => {

  const now = new Date();

  const updated = new Date(dateString);

  const diffSeconds =
    Math.floor(
      (now - updated) / 1000
    );

  if(diffSeconds < 60){
    return `Updated ${diffSeconds}s ago`;
  }

  const diffMinutes =
    Math.floor(diffSeconds / 60);

  if(diffMinutes < 60){
    return `Updated ${diffMinutes}m ago`;
  }

  const diffHours =
    Math.floor(diffMinutes / 60);

  if(diffHours < 24){
    return `Updated ${diffHours}h ago`;
  }

  return updated.toLocaleDateString(
    "en-IN",
    {
      day:"numeric",
      month:"short",
      year:"numeric"
    }
  );
};