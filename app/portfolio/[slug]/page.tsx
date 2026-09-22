import db from "@/lib/db";

type PortfolioGroup = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

type PortfolioImage = {
  id: number;
  group_id: number;
  image_url: string;
  public_id: string;
  display_order: number;
  is_visible: boolean;
};

async function getGroup(
  slug: string
): Promise<PortfolioGroup | null> {
  const [rows] = await db.query(
    `
      SELECT
        id,
        name,
        slug,
        description
      FROM portfolio_groups
      WHERE slug = ?
        AND is_visible = TRUE
      LIMIT 1
    `,
    [slug]
  );

  const groups = rows as PortfolioGroup[];

  return groups[0] ?? null;
}

async function getImages(
  groupId: number
): Promise<PortfolioImage[]> {
  const [rows] = await db.query(
    `
      SELECT
        id,
        group_id,
        image_url,
        public_id,
        display_order,
        is_visible
      FROM portfolio_images
      WHERE group_id = ?
        AND is_visible = TRUE
      ORDER BY display_order ASC, id ASC
    `,
    [groupId]
  );

  return rows as PortfolioImage[];
}

export default async function PortfolioGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const group = await getGroup(slug);

  /*
  ========================================================
  Group Not Found
  ========================================================
  */

  if (!group) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F8FC] px-6">
        <div className="text-center">

          <h1 className="text-4xl font-bold text-[#071A2F]">
            Group Not Found
          </h1>

          <p className="mt-3 text-[#5B6B7F]">
            The portfolio group you are looking for
            does not exist.
          </p>

          <a
            href="/portfolio"
            className="mt-6 inline-block text-[#00B8D9] transition hover:underline"
          >
            Back to Portfolio
          </a>

        </div>
      </main>
    );
  }

  const images = await getImages(group.id);

  return (
    <main className="min-h-screen bg-[#F5F8FC]">

      {/* ==================================================
          Header
      ================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <a
            href="/portfolio"
            className="group"
          >
            <h1 className="text-xl font-bold text-[#071A2F] transition group-hover:text-[#00B8D9]">
              RAED
            </h1>

            <p className="text-xs tracking-widest text-[#00B8D9]">
              ADVERTISING
            </p>
          </a>

          <a
            href="/portfolio"
            className="text-sm font-medium text-[#071A2F] transition hover:text-[#00B8D9]"
          >
            Back to Portfolio
          </a>

        </div>
      </header>


      {/* ==================================================
          Group Introduction
      ================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-12 pt-20">

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#00B8D9]">
          Portfolio
        </p>

        <h2 className="text-4xl font-bold text-[#071A2F] md:text-6xl">
          {group.name}
        </h2>

        {group.description && (
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#5B6B7F]">
            {group.description}
          </p>
        )}

      </section>


      {/* ==================================================
          Images
      ================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-24">

        {images.length === 0 ? (

          <div className="rounded-xl bg-white p-12 text-center shadow-sm">

            <h3 className="text-xl font-semibold text-[#071A2F]">
              No projects yet
            </h3>

            <p className="mt-2 text-sm text-[#5B6B7F]">
              There are no images in this portfolio group yet.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {images.map((image) => (

              <article
                key={image.id}
                className="group overflow-hidden rounded-xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="overflow-hidden bg-slate-100">

                  <img
                    src={image.image_url}
                    alt={group.name}
                    className="block h-auto w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}