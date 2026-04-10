const ConfidentialityBanner = () => (
  <div className="w-full rounded-xl bg-[hsl(220,20%,97%)] border border-[hsl(220,13%,91%)] px-4 py-3">
    <p className="text-sm font-semibold text-foreground/80">
      Tus respuestas son confidenciales
    </p>
    <p className="text-sm text-muted-foreground mt-0.5">
      Se analizan de forma agregada y no se comparten individualmente con tu líder.
    </p>
  </div>
);

export default ConfidentialityBanner;
