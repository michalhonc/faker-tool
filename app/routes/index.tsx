import { Fragment } from 'react'
import { json } from "@remix-run/cloudflare";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { faker } from "@faker-js/faker";

const rootKeys = Object.keys(faker);
const result = rootKeys.reduce((acc, curr) => {
  if (!acc[curr]) {
    const functions = Object.keys(faker[curr]).reduce((ac, cur) => {
      if (typeof faker[curr][cur] === "function") {
        ac.push(cur);
      }
      return ac;
    }, []);

    if (functions.length > 0) {
      acc[curr] = functions
    }
  }

  return acc;
}, {});

const loader: LoaderFunction = ({ params, request }) => {
  return json({ data: result });
};

function Index() {
  const { data } = useLoaderData();

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.4",
        whiteSpace: "break-spaces",
      }}
    >
      <strong>Add ?n=(number) for (number) of results</strong>
      <hr />
      <dl>
        {Object.keys(data).map((key) => (
          <Fragment key={key}>
            <dt>{key}</dt>
            <dd>
              <ul>
                {data[key].map((item) => (
                  <li key={item}><a href={`/${key}/${item}`}>{item}</a></li>
                ))}
              </ul>
            </dd>
          </Fragment>
        ))}
      </dl>
    </div>
  );
}

export { Index as default, loader };
