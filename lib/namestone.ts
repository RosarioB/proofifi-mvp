"use server"

import NameStone from "namestone-sdk";

const ns = new NameStone(process.env.NEXT_PUBLIC_NAMESTONE_API_KEY || "");

const domain = "proofifi.eth";

export async function getData() {
  return await ns.getNames({ domain: domain });
}



