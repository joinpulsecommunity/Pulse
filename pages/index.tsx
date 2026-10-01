import Head from "next/head";
import { useTina } from "tinacms/dist/react";
import client from "../tina/__generated__/client";
import Site from "../components/Site";

export default function Home(props: any) {
  // useTina keeps the page in sync with what's being typed in the editor
  const { data } = useTina({ query: props.query, variables: props.variables, data: props.data });
  return (
    <>
      <Head>
        <title>PULSE | South Forsyth High School</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="PULSE — Public Unified Leadership and Service Enterprise. A student fundraising and volunteering organization at South Forsyth High School."
        />
      </Head>
      <Site s={data.site} />
    </>
  );
}

export const getStaticProps = async () => {
  const res = await client.queries.site({ relativePath: "site.json" });
  return { props: { query: res.query, variables: res.variables, data: res.data } };
};
