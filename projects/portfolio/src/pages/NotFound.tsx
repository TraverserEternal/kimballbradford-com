import { url } from "../routes";

export function NotFound() {
  return (
    <div class="not-found">
      <h1>404</h1>
      <p>The page you&rsquo;re looking for doesn&rsquo;t exist.</p>
      <div class="links">
        <a href={url("/")} class="btn">Back to Home</a>
      </div>
    </div>
  );
}
