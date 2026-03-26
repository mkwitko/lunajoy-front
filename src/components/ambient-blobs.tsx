export default function AmbientBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.07]"
        style={{
          background:
            "radial-gradient(circle, var(--primary), transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.05]"
        style={{
          background:
            "radial-gradient(circle, var(--secondary), transparent 70%)",
        }}
      />
    </div>
  );
}
