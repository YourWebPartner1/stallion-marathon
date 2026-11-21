import { workshops } from "@/lib/content";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Accepts a workshop seat request.
 *
 * TODO: this only checks the request. Connect it to where reservations
 * should go (email, CRM, Google Sheet or a database) before launch.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const workshop = workshops.find((w) => w.id === body.workshopId);

  if (!workshop) return Response.json({ error: "Unknown workshop." }, { status: 400 });
  if (name.length < 2 || name.length > 120) return Response.json({ error: "Please enter your name." }, { status: 400 });
  if (!EMAIL.test(email) || email.length > 200)
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (phone.length > 20) return Response.json({ error: "Please check your phone number." }, { status: 400 });

  // Personal details are not logged on purpose; store them in the destination above.
  console.info("[reservation] seat requested for", workshop.id);

  return Response.json({ ok: true });
}
