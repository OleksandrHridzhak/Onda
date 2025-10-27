export default function SettingsTemplate({ title, children }) {

  return (
    <div className="space-y-6">
      <div className={`border-b border-ui-border pb-4`}>
        <h3 className={`text-24 font-medium text-text-secondary`}>
          {title}
        </h3>
        <div className="mt-4 space-y-3">{children}</div>
      </div>
    </div>
  );
}
