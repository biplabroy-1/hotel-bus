"use server"

export default async function getDishes(hotelId: string) {
  const uid = typeof window !== "undefined" ? localStorage.getItem("uid") : null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dishes?hotel=${hotelId}`, {
    headers: {
      "x-uid": uid || "",
    },
  });

  return res.json();
}
