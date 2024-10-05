"use server";

import NameStone from "namestone-sdk";

const ns = new NameStone(process.env.NEXT_PUBLIC_NAMESTONE_API_KEY || "");

const DOMAIN = "proofifi.eth";

interface SetNameParams {
  name: string;
  domain: string;
  address: string;
}

export async function getData() {
  return await ns.getNames({ domain: DOMAIN });
}

export async function createEnsName(name: string, address: string) {
 await ns.setName(getNameParams(name, DOMAIN, address));
}

function getNameParams(
  name: string,
  domain: string,
  address: string
): SetNameParams {
  return {
    name,
    domain,
    address,
  };
}
