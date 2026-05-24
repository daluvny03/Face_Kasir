function MemberNotification({
  result
}) {
  if (
    result?.status !==
    "recognized"
  ) return null;
  return (
    <div className="
      bg-emerald-500
      text-white
      rounded-3xl
      p-6
      shadow-2xl
      animate-pulse
    ">
      <p className="
        text-lg
        font-semibold
      ">
        MEMBER DETECTED
      </p>
      <h2 className="
        text-4xl
        font-bold
        mt-2
      ">
        {result.name}
      </h2>
      <div className="
        mt-4
      ">
        <p className="
          text-2xl
          font-bold
        ">
          10% Discount Applied
        </p>
        <p className="
          mt-2
        ">
          Gold Member Benefit
        </p>
      </div>
    </div>
  );
}

export default MemberNotification;