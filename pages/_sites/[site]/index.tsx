import Head from "next/head"
import { Layout, Page, Text, Link, List } from "@vercel/edge-functions-ui"

export default function Index(props) {
  return (
    <Page>
      <Head>
        <title>{props.name} - Vercel Edge Functions</title>
        <meta itemProp="description" content={props.description} />
      </Head>
      <Text variant="h1" className="mb-6">
        {props.name}
      </Text>
      <div className="mb-4">
        <Link className="mr-2.5" href="/">
          Home
        </Link>
        <Link href="/about">About</Link>
      </div>
      <Text variant="h2" className="mb-6">
        More examples:
      </Text>
      <List>
        <li>
          <Link href="https://subdomain-1.sonessonholdings.se">
            subdomain-1.sonessonholdings.se
          </Link>
        </li>
        <li>
          <Link href="https://subdomain-2.sonessonholdings.se">
            subdomain-2.sonessonholdings.se
          </Link>
        </li>
        <li>
          <Link href="https://subdomain-3.sonessonholdings.se">
            subdomain-3.sonessonholdings.se
          </Link>
        </li>
        <li>
          <Link href="https://custom-domain-1.com">custom-domain-1.com</Link>{" "}
          (maps to{" "}
          <Link href="https://subdomain-1.sonessonholdings.se">
            subdomain-1.sonessonholdings.se
          </Link>
          )
        </li>
      </List>
    </Page>
  )
}

Index.Layout = Layout

const mockDB = [
  {
    name: "Site 1",
    description: "Custom domain",
    subdomain: null,
    customDomain: "i18n-middleware.vercel.app",
  },
  {
    name: "Site 1",
    description: "Subdomain only",
    subdomain: "subdomain-1",
    customDomain: null,
  },
  {
    name: "Site 2",
    description: "Subdomain only",
    subdomain: "subdomain-2",
    customDomain: null,
  },
  {
    name: "Site 3",
    description: "Subdomain only",
    subdomain: "subdomain-3",
    customDomain: null,
  },
]

export async function getStaticPaths() {
  // get all sites that have subdomains set up
  const subdomains = mockDB.filter(item => item.subdomain)

  // get all sites that have custom domains set up
  const customDomains = mockDB.filter(item => item.customDomain)

  // build paths for each of the sites in the previous two lists
  const paths = [
    ...subdomains.map(item => {
      return { params: { site: item.subdomain } }
    }),
    ...customDomains.map(item => {
      return { params: { site: item.customDomain } }
    }),
  ]
  return {
    paths: paths,
    fallback: true, // fallback true allows sites to be generated using ISR
  }
}

export async function getStaticProps({ params: { site } }) {
  // check if site is a custom domain or a subdomain
  const customDomain = site.includes(".") ? true : false

  // fetch data from mock database using the site value as the key
  const data = mockDB.filter(item =>
    customDomain ? item.customDomain == site : item.subdomain == site
  )

  return {
    props: { ...data[0] },
    revalidate: 3600, // set revalidate interval of 1h
  }
}
