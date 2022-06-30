import { json, redirect } from "@remix-run/cloudflare";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { faker } from "@faker-js/faker";

const loader: LoaderFunction = ({ params, request }) => {
  const nQuery = Number(new URL(request.url).searchParams.get("n"));
  const numberOfItems = Math.min(nQuery, 50)
  const delimiter = new URL(request.url).searchParams.get("d") ?? "\n";

  const [root, functionKey, ...functionParams] = params?.["*"].split("/") ?? [];

  if (
    !root ||
    !functionKey ||
    !(root in faker) ||
    typeof faker[root]?.[functionKey] !== "function"
  ) {
    return redirect("/");
  }

  const results = [];
  const getResult = () => faker[root][functionKey](...functionParams.map(f => f === '_' ? undefined : f));

  if (Number.isInteger(numberOfItems) && numberOfItems !== 0) {
    for (let i = 0; i < numberOfItems; i++) {
      results.push(getResult());
    }
  } else {
    results.push(getResult());
  }

  return json({ data: results.join(delimiter) });
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
      {data}
    </div>
  );
}

export { Index as default, loader };
