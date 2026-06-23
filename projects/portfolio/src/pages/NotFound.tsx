import { url } from "../routes";

export function NotFound() {
  return (
    <div class="not-found">
      <h1>404</h1>
      <p>Page not found.</p>
      <div class="links">
        <a href={url("/")}>Home</a>
        <button onClick={() => history.back()}>Go Back</button>
      </div>
    </div>
  );
}
