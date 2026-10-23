const HASURA_URL = "https://inviting-gannet-50.hasura.app/v1/graphql";

async function gql(query, variables = {}) {
    const headers = {
        "Content-Type": "application/json"
    };

    const res = await fetch(HASURA_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ query, variables })
    });

    const json = await res.json();

    if (json.errors) {
        throw new Error(
            json.errors.map(e => e.message).join("; ")
        );
    }

    return json.data;
}