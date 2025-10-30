import packageJson from "../../package.json";
import Modal from "../Modal/Modal";
import "./about.css";

function getRepositoryUrl(repositoryString) {
  const [, service, user, repo] =
    repositoryString.match(/^(.*):(.*)\/(.*)$/) || [];

  if (service === "github") {
    return `https://github.com/${user}/${repo}`;
  }
  return "";
}

export default function About({ packages, onClose }) {
  const repositoryUrl =
    packageJson.repository && getRepositoryUrl(packageJson.repository);
  return (
    <Modal
      onClose={onClose}
      footerChildren={
        <button style="min-width:7em" onClick={onClose}>
          Ok
        </button>
      }
    >
      <div class="about">
        <div class="about__header about__content">
          <img class="about__icon" src="/favicon.svg" alt="" />

          <h2 class="about__heading">
            <span class="about__name">{packageJson.displayName}</span>{" "}
            <span class="about__version">v{packageJson.version}</span>
          </h2>
          <p class="about__description">{packageJson.description}</p>

          <p class="about__legal">
            {packageJson.author && (
              <span class="about__copyright">
                &copy;
                {import.meta.env.VITE_COPYRIGHT_YEAR ||
                  new Date().getFullYear()}{" "}
                <a href={packageJson.author.url} target="_blank">
                  {packageJson.author.name}
                </a>
                .{" "}
              </span>
            )}
            {packageJson.license && (
              <span class="about__license">
                Distributed under the{" "}
                <a
                  href={`https://spdx.org/licenses/${packageJson.license}.html`}
                  target="_blank"
                >
                  {packageJson.license} license
                </a>
                .{" "}
              </span>
            )}
          </p>
          <ul class="about__links">
            {repositoryUrl && (
              <li>
                <a href={repositoryUrl} target="_blank">
                  Source code
                </a>
              </li>
            )}
            {packageJson.bugs?.url && (
              <li>
                <a href={packageJson.bugs.url} target="_blank">
                  Report a bug
                </a>
              </li>
            )}
            {packageJson.bugs?.email && (
              <li>
                <a href={`mailto:${packageJson.bugs.email}`}>Send feedback</a>
              </li>
            )}
          </ul>
        </div>

        <div class="about__body about__content">
          <p>
            {packageJson.displayName} is made possible by the following open
            source&nbsp;packages:
          </p>
          <table>
            <thead class="sr-only">
              <tr>
                <th>Package</th>
                <th>Version</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((packageJson) => (
                <tr>
                  <td>
                    {packageJson.homepage ? (
                      <a href={packageJson.homepage} target="_blank">
                        {packageJson.name}
                      </a>
                    ) : (
                      packageJson.name
                    )}
                  </td>
                  <td>v{packageJson.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
