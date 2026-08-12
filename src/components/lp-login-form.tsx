type LoginError = "invalid" | "rate" | "request" | "config";

const ERROR_MESSAGES: Record<LoginError, string> = {
  invalid: "That access password is not valid.",
  rate: "Too many attempts. Try again later.",
  request: "We could not process that request. Please try again.",
  config: "Investor access is not configured yet.",
};

export function LpLoginForm({ error }: { error?: string }) {
  const message = error && error in ERROR_MESSAGES ? ERROR_MESSAGES[error as LoginError] : "";

  return (
    <form className="lp-login-form" action="/api/lp/session" method="post">
      <label htmlFor="lp-password">Access password</label>
      <div className="lp-login-input-row">
        <input
          id="lp-password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          minLength={12}
          maxLength={256}
          aria-describedby={message ? "lp-login-error" : "lp-login-note"}
        />
        <button type="submit">
          Enter portal
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      {message ? (
        <p id="lp-login-error" className="lp-login-error" role="alert">
          {message}
        </p>
      ) : (
        <p id="lp-login-note" className="lp-login-note">
          Investor information is private and intended only for authorized limited partners.
        </p>
      )}
    </form>
  );
}
