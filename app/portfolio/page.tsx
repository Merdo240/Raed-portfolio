import db from "@/lib/db";
export const dynamic = "force-dynamic";

type PortfolioGroup = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  display_order: number;
  is_visible: boolean;
};

/* =========================================================
   CLOUDINARY ASSETS
   ضع روابط الصور الخاصة بك هنا
   ========================================================= */

   const BRAND_LOGO_URL = "https://raw.githubusercontent.com/Merdo240/Raed-portfolio/main/assets/Logo.png";
  const HERO_MAIN_IMAGE_URL = "";
   const HERO_DECORATION_URL = "";
const HERO_SMALL_LOGO_URL = "https://raw.githubusercontent.com/Merdo240/Raed-portfolio/main/assets/Logo.png";

/* صورة إضافية اختيارية للعنصر العائم */
const HERO_FLOATING_IMAGE_URL = "";

/* =========================================================
   DATABASE
   ========================================================= */

async function getGroups(): Promise<PortfolioGroup[]> {
  const [rows] = await db.query(
    `
      SELECT
        id,
        name,
        slug,
        description,
        cover_image_url,
        display_order,
        is_visible
      FROM portfolio_groups
      WHERE is_visible = TRUE
      ORDER BY display_order ASC, id ASC
    `
  );

  return rows as PortfolioGroup[];
}

/* =========================================================
   PAGE
   ========================================================= */

export default async function PortfolioPage() {
  const groups = await getGroups();

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F9FC] text-[#071A2F]">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="absolute left-0 right-0 top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">

          {/* Logo */}
          <a
            href="/portfolio"
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-[#071A2F] shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:bg-[#00B8D9]">

              {BRAND_LOGO_URL ? (
                <img
                  src={BRAND_LOGO_URL}
                  alt="RAED Advertising"
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <span className="text-xl font-black text-white">
                  R
                </span>
              )}

            </div>

            <div className="leading-none">
              <div className="text-lg font-black tracking-tight text-[#071A2F]">
                RAED
              </div>

              <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-[#5B6B7F]">
                Advertising
              </div>
            </div>
          </a>

          {/* Navigation */}
          <nav className="hidden items-center gap-9 md:flex">

            <a
              href="#work"
              className="text-sm font-semibold text-[#071A2F] transition hover:text-[#00B8D9]"
            >
              Our Work
            </a>

            <a
              href="#about"
              className="text-sm font-semibold text-[#071A2F] transition hover:text-[#00B8D9]"
            >
              About
            </a>

            <a
              href="#contact"
              className="rounded-lg bg-[#071A2F] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#00B8D9]"
            >
              Contact
            </a>

          </nav>

        </div>
      </header>


      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="relative min-h-[760px] overflow-hidden pt-32 lg:min-h-[820px]">

        {/* Background */}
        <div className="absolute inset-0">

          {/* Soft cyan glow */}
          <div className="absolute -left-32 top-32 h-96 w-96 rounded-full bg-[#00B8D9]/10 blur-3xl" />

          {/* Navy glow */}
          <div className="absolute right-[-120px] top-20 h-[500px] w-[500px] rounded-full bg-[#123B70]/10 blur-3xl" />

          {/* Small cyan circle */}
          <div className="absolute left-[8%] top-[22%] h-3 w-3 rounded-full bg-[#00B8D9]" />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `
                linear-gradient(#071A2F 1px, transparent 1px),
                linear-gradient(90deg, #071A2F 1px, transparent 1px)
              `,
              backgroundSize: "45px 45px",
            }}
          />

        </div>


        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">

          {/* =================================================
              HERO LEFT
              ================================================= */}

          <div className="relative z-10 max-w-2xl">

            {/* Small badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#00B8D9]/20 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">

              <span className="h-2 w-2 rounded-full bg-[#00B8D9]" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#123B70]">
                Creative Advertising Studio
              </span>

            </div>


            {/* Main heading */}
            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.04em] text-[#071A2F] sm:text-6xl lg:text-7xl">

              We create

              <span className="relative mt-2 block text-[#00B8D9]">

                visual impact.

                <span className="absolute -bottom-2 left-0 h-1 w-20 rounded-full bg-[#071A2F]" />

              </span>

            </h1>


            {/* Description */}
            <p className="mt-8 max-w-xl text-base leading-8 text-[#5B6B7F] sm:text-lg">
              We turn ideas into powerful visual experiences through
              advertising, branding, creative design and digital media.
            </p>


            {/* Buttons */}
            <div className="mt-9 flex flex-wrap gap-4">

              <a
                href="#work"
                className="group inline-flex items-center gap-3 rounded-lg bg-[#071A2F] px-6 py-4 text-sm font-bold text-white shadow-xl shadow-[#071A2F]/10 transition-all duration-300 hover:-translate-y-1 hover:bg-[#123B70]"
              >
                Explore Our Work

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>


              <a
                href="#contact"
                className="inline-flex items-center rounded-lg border border-[#071A2F]/10 bg-white px-6 py-4 text-sm font-bold text-[#071A2F] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00B8D9] hover:text-[#00B8D9]"
              >
                Start a Project
              </a>

            </div>


            {/* Stats */}
            <div className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-[#071A2F]/10 pt-7">

              <div>
                <div className="text-2xl font-black text-[#071A2F]">
                  {groups.length}
                </div>

                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#7B8999]">
                  Categories
                </div>
              </div>


              <div>
                <div className="text-2xl font-black text-[#071A2F]">
                  01
                </div>

                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#7B8999]">
                  Creative Direction
                </div>
              </div>


              <div>
                <div className="text-2xl font-black text-[#071A2F]">
                  RAED
                </div>

                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#7B8999]">
                  Advertising
                </div>
              </div>

            </div>

          </div>


          {/* =================================================
    HERO RIGHT
    ================================================= */}

<div className="relative hidden h-[590px] lg:block">

  {/* =================================================
      BACKGROUND DECORATION
      ================================================= */}

  <div className="absolute right-4 top-8 h-[430px] w-[330px] rotate-6 rounded-[32px] border border-[#123B70]/10 bg-[#123B70]/5" />

  <div className="absolute right-10 top-16 h-[430px] w-[330px] -rotate-3 rounded-[32px] border border-[#00B8D9]/10 bg-white shadow-sm" />


  {/* Cloudinary decoration */}
  {HERO_DECORATION_URL && (
    <img
      src={HERO_DECORATION_URL}
      alt=""
      className="absolute -right-8 -top-8 z-30 h-36 w-36 object-contain opacity-90"
    />
  )}


  {/* =================================================
      MAIN CARD
      ================================================= */}

  <div className="absolute right-20 top-12 h-[470px] w-[360px] overflow-hidden rounded-[30px] bg-[#071A2F] shadow-[0_30px_80px_rgba(7,26,47,0.25)]">


    {/* =================================================
        IMAGE
        ================================================= */}

    {HERO_MAIN_IMAGE_URL ? (

      <img
        src={HERO_MAIN_IMAGE_URL}
        alt="RAED Advertising"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
      />

    ) : (

      <div className="absolute inset-0">

        {/* Huge R */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[280px] font-black leading-none text-white/[0.045]">
          R
        </div>

        {/* Cyan circle */}
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00B8D9]/20 bg-[#00B8D9]/10 shadow-[0_0_80px_rgba(0,184,217,0.35)]" />

        {/* Center point */}
        <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00B8D9]" />

      </div>

    )}


    {/* =================================================
        IMAGE OVERLAY
        ================================================= */}

    <div className="absolute inset-0 bg-gradient-to-t from-[#071A2F] via-[#071A2F]/10 to-transparent" />

    <div className="absolute inset-0 bg-gradient-to-br from-[#00B8D9]/10 via-transparent to-transparent" />


    {/* =================================================
        TOP LOGO
        ================================================= */}

    <div className="absolute left-7 top-7 z-20">

      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/95 p-3 shadow-xl">

        {HERO_SMALL_LOGO_URL ? (

          <img
            src={HERO_SMALL_LOGO_URL}
            alt="RAED"
            className="h-full w-full object-contain"
          />

        ) : (

          <div className="text-2xl font-black text-[#071A2F]">
            R<span className="text-[#00B8D9]">.</span>
          </div>

        )}

      </div>

    </div>


    {/* =================================================
        TOP LABEL
        ================================================= */}

    <div className="absolute right-7 top-7 z-20">

      <div className="rounded-full border border-white/15 bg-black/20 px-4 py-2 backdrop-blur-md">

        <div className="flex items-center gap-2">

          <span className="h-1.5 w-1.5 rounded-full bg-[#00B8D9]" />

          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/80">
            RAED Studio
          </span>

        </div>

      </div>

    </div>


    {/* =================================================
        BOTTOM CONTENT
        ================================================= */}

    <div className="absolute bottom-0 left-0 right-0 z-20 p-8">

      <div className="mb-4 flex items-center gap-3">

        <span className="h-1 w-10 rounded-full bg-[#00B8D9]" />

        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#00B8D9]">
          Creative Direction
        </span>

      </div>


      <h3 className="text-3xl font-black tracking-tight text-white">
        Visual
        <br />
        Impact.
      </h3>


      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">

        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
          RAED Advertising
        </span>

        <span className="text-lg text-white">
          ↗
        </span>

      </div>

    </div>

  </div>


  {/* =================================================
      FLOATING IMAGE / LOGO
      ================================================= */}

  <div className="absolute bottom-20 left-0 z-40">

    <div className="relative">

      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-[#00B8D9]/20 blur-xl" />


      {/* Card */}
      <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-white bg-white p-4 shadow-2xl">

        {HERO_FLOATING_IMAGE_URL ? (

          <img
            src={HERO_FLOATING_IMAGE_URL}
            alt=""
            className="h-full w-full object-contain"
          />

        ) : HERO_SMALL_LOGO_URL ? (

          <img
            src={HERO_SMALL_LOGO_URL}
            alt="RAED"
            className="h-full w-full object-contain"
          />

        ) : (

          <div className="text-5xl font-black text-[#071A2F]">
            R<span className="text-[#00B8D9]">.</span>
          </div>

        )}

      </div>

    </div>

  </div>


  {/* =================================================
      FLOATING TEXT BADGE
      ================================================= */}

  <div className="absolute bottom-6 right-0 z-40">

    <div className="flex items-center gap-3 rounded-full border border-white/70 bg-white px-5 py-3 shadow-xl">

      <span className="relative flex h-3 w-3">

        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00B8D9] opacity-40" />

        <span className="relative inline-flex h-3 w-3 rounded-full bg-[#00B8D9]" />

      </span>

      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#071A2F]">
        Creative • Precise • Modern
      </span>

    </div>

  </div>


  {/* =================================================
      SMALL DECORATIVE DOTS
      ================================================= */}

  <div className="absolute left-20 top-20 z-20 grid grid-cols-3 gap-2">

    {Array.from({ length: 9 }).map((_, index) => (
      <span
        key={index}
        className="h-1.5 w-1.5 rounded-full bg-[#00B8D9]/40"
      />
    ))}

  </div>

</div>
        </div>

      </section>


      {/* =====================================================
          WORK
          ===================================================== */}

      {/* =====================================================
    WORK
    ===================================================== */}

<section
  id="work"
  className="relative overflow-hidden bg-white py-28"
>

  {/* Background decoration */}
  <div className="pointer-events-none absolute right-[-120px] top-20 h-80 w-80 rounded-full bg-[#00B8D9]/5 blur-3xl" />

  <div className="pointer-events-none absolute bottom-0 left-[-150px] h-96 w-96 rounded-full bg-[#123B70]/5 blur-3xl" />


  <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

    {/* =================================================
        SECTION HEADER
        ================================================= */}

    <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">

      <div>

        <div className="mb-5 flex items-center gap-3">

          <span className="h-px w-10 bg-[#00B8D9]" />

          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#00B8D9]">
            Selected Work
          </span>

        </div>


        <h2 className="max-w-xl text-4xl font-black leading-tight tracking-[-0.03em] text-[#071A2F] sm:text-5xl">

          Ideas turned into
          
          <span className="block text-[#00B8D9]">
            visual experiences.
          </span>

        </h2>

      </div>


      <div className="max-w-md">

        <p className="text-sm leading-7 text-[#5B6B7F]">
          Explore our creative categories and discover how ideas become
          memorable visual identities.
        </p>


        <div className="mt-5 flex items-center gap-3">

          <span className="text-xs font-bold text-[#071A2F]">
            {groups.length}
          </span>

          <span className="h-px w-12 bg-[#071A2F]/15" />

          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B8999]">
            Creative Categories
          </span>

        </div>

      </div>

    </div>


    {/* =================================================
        EMPTY STATE
        ================================================= */}

    {groups.length === 0 ? (

      <div className="rounded-3xl border border-dashed border-[#071A2F]/15 bg-[#F7F9FC] px-6 py-24 text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#071A2F] text-2xl font-black text-white">
          R
        </div>

        <h3 className="mt-6 text-xl font-black text-[#071A2F]">
          No projects yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5B6B7F]">
          Your portfolio categories will appear here once you add them
          from the database.
        </p>

      </div>

    ) : (

      /* =================================================
         PROJECT GRID
         ================================================= */

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">

        {groups.map((group, index) => {

          const featured =
            index === 0 ||
            index === 3;

          return (

            <a
              key={group.id}
              href={`/portfolio/${group.slug}`}
              className={`group relative overflow-hidden rounded-[22px] bg-[#071A2F] shadow-[0_15px_50px_rgba(7,26,47,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(7,26,47,0.18)] ${
                featured
                  ? "lg:col-span-7"
                  : "lg:col-span-5"
              }`}
            >

              {/* =================================================
                  IMAGE
                  ================================================= */}

              <div
                className={`relative overflow-hidden ${
                  featured
                    ? "aspect-[1.25/1]"
                    : "aspect-[1.1/1]"
                }`}
              >

                {group.cover_image_url ? (

                  <img
                    src={group.cover_image_url}
                    alt={group.name}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                  />

                ) : (

                  <div className="absolute inset-0 bg-[#123B70]">

                    <div className="absolute inset-0 flex items-center justify-center">

                      <span className="text-[180px] font-black leading-none text-white/[0.05]">
                        R
                      </span>

                    </div>

                  </div>

                )}


                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071A2F] via-[#071A2F]/30 to-transparent opacity-90 transition duration-500 group-hover:opacity-100" />


                {/* Cyan light */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00B8D9]/0 via-transparent to-[#00B8D9]/10 opacity-0 transition duration-500 group-hover:opacity-100" />


                {/* =================================================
                    TOP CONTENT
                    ================================================= */}

                <div className="absolute left-6 right-6 top-6 flex items-center justify-between">

                  {/* Number */}

                  <div className="flex items-center gap-3">

                    <span className="text-xs font-black tracking-[0.2em] text-[#00B8D9]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="h-px w-8 bg-white/20" />

                  </div>


                  {/* Arrow */}

                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/10 text-lg text-white backdrop-blur-sm transition-all duration-300 group-hover:border-[#00B8D9] group-hover:bg-[#00B8D9] group-hover:text-[#071A2F]">

                    <span className="transition-transform duration-300 group-hover:-rotate-45">
                      ↗
                    </span>

                  </div>

                </div>


                {/* =================================================
                    BOTTOM CONTENT
                    ================================================= */}

                <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-8">

                  {/* Category */}

                  <div className="mb-3 flex items-center gap-2">

                    <span className="h-1.5 w-1.5 rounded-full bg-[#00B8D9]" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#00B8D9]">
                      Creative Category
                    </span>

                  </div>


                  {/* Name */}

                  <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                    {group.name}
                  </h3>


                  {/* Description */}

                  {group.description && (

                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 transition duration-300 group-hover:text-white/80">
                      {group.description}
                    </p>

                  )}


                  {/* Bottom line */}

                  <div className="mt-6 flex items-center gap-3">

                    <div className="h-1 w-10 rounded-full bg-[#00B8D9] transition-all duration-500 group-hover:w-20" />

                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                      View Projects
                    </span>

                  </div>

                </div>


                {/* Bottom cyan border */}

                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#00B8D9] transition-all duration-500 group-hover:w-full" />

              </div>

            </a>

          );

        })}

      </div>

    )}

  </div>

</section>


      {/* =====================================================
          ABOUT
          ===================================================== */}

      {/* =====================================================
    ABOUT
    ===================================================== */}

<section
  id="about"
  className="relative overflow-hidden bg-[#071A2F] py-28 text-white"
>

  {/* Decorative elements */}
  <div className="pointer-events-none absolute -right-32 top-[-120px] h-96 w-96 rounded-full border-[60px] border-[#00B8D9]/5" />

  <div className="pointer-events-none absolute bottom-[-180px] left-[-120px] h-96 w-96 rounded-full border-[50px] border-white/[0.03]" />

  <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

    <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

      {/* LEFT */}

      <div>

        <div className="mb-6 flex items-center gap-3">

          <span className="h-px w-10 bg-[#00B8D9]" />

          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#00B8D9]">
            About RAED
          </span>

        </div>


        <h2 className="max-w-xl text-4xl font-black leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">

          We don't just
          <span className="block text-[#00B8D9]">
            make designs.
          </span>

        </h2>


        <p className="mt-8 max-w-xl text-base leading-8 text-white/55 sm:text-lg">
          We build visual experiences designed to communicate,
          connect and leave a lasting impression.
        </p>

      </div>


      {/* RIGHT */}

      <div className="relative">

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">

          {/* Card 01 */}

          <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:border-[#00B8D9]/40 hover:bg-white/[0.05]">

            <div className="mb-8 flex items-center justify-between">

              <span className="text-xs font-black text-[#00B8D9]">
                01
              </span>

              <span className="text-white/20 transition group-hover:text-[#00B8D9]">
                ↗
              </span>

            </div>

            <h3 className="text-xl font-black">
              Modern
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Clean visual systems built for today's audience.
            </p>

          </div>


          {/* Card 02 */}

          <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:border-[#00B8D9]/40 hover:bg-white/[0.05]">

            <div className="mb-8 flex items-center justify-between">

              <span className="text-xs font-black text-[#00B8D9]">
                02
              </span>

              <span className="text-white/20 transition group-hover:text-[#00B8D9]">
                ↗
              </span>

            </div>

            <h3 className="text-xl font-black">
              Creative
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Ideas transformed into distinctive visual concepts.
            </p>

          </div>


          {/* Card 03 */}

          <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:border-[#00B8D9]/40 hover:bg-white/[0.05]">

            <div className="mb-8 flex items-center justify-between">

              <span className="text-xs font-black text-[#00B8D9]">
                03
              </span>

              <span className="text-white/20 transition group-hover:text-[#00B8D9]">
                ↗
              </span>

            </div>

            <h3 className="text-xl font-black">
              Precise
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Every detail has a purpose and every element has a role.
            </p>

          </div>

        </div>

      </div>

    </div>

  </div>

</section>


      {/* =====================================================
          CONTACT
          ===================================================== */}

      {/* =====================================================
    CONTACT
    ===================================================== */}

<section
  id="contact"
  className="relative overflow-hidden bg-[#F7F9FC] py-28"
>

  <div className="mx-auto max-w-7xl px-6 lg:px-8">

    <div className="relative overflow-hidden rounded-[30px] bg-[#00B8D9] px-8 py-16 sm:px-14 lg:px-20">

      {/* Decorations */}

      <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border-[55px] border-white/10" />

      <div className="pointer-events-none absolute -bottom-32 left-1/2 h-72 w-72 rounded-full border-[45px] border-[#071A2F]/5" />


      <div className="relative z-10 max-w-3xl">

        <div className="mb-6 flex items-center gap-3">

          <span className="h-2 w-2 rounded-full bg-[#071A2F]" />

          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#071A2F]/60">
            Let's work together
          </span>

        </div>


        <h2 className="text-4xl font-black leading-[1.05] tracking-[-0.03em] text-[#071A2F] sm:text-5xl lg:text-6xl">
          Have an idea?
          <span className="block text-white">
            Let's create it.
          </span>
        </h2>


        <p className="mt-7 max-w-xl text-base leading-7 text-[#071A2F]/65">
          Tell us about your project and let's turn your idea into
          something people remember.
        </p>


        <a
          href="https://wa.me/967770282271"
          className="group mt-9 inline-flex items-center gap-4 rounded-xl bg-[#071A2F] px-7 py-4 text-sm font-bold text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-[#123B70]"
        >

          Get in touch

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>

        </a>

      </div>


      {/* Bottom label */}

      <div className="absolute bottom-7 right-8 hidden items-center gap-3 sm:flex">

        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#071A2F]/40">
          RAED Advertising
        </span>

        <span className="h-px w-8 bg-[#071A2F]/20" />

      </div>

    </div>

  </div>

</section>

      {/* =====================================================
          FOOTER
          ===================================================== */}

     {/* =====================================================
    FOOTER
    ===================================================== */}

<footer className="border-t border-[#071A2F]/10 bg-white">

  <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

    <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

      {/* Brand */}

      <div>

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[#071A2F]">

            {BRAND_LOGO_URL ? (

              <img
                src={BRAND_LOGO_URL}
                alt="RAED Advertising"
                className="h-full w-full object-contain p-2"
              />

            ) : (

              <span className="font-black text-white">
                R
              </span>

            )}

          </div>


          <div>

            <div className="font-black text-[#071A2F]">
              RAED
            </div>

            <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#7B8999]">
              Advertising
            </div>

          </div>

        </div>


        <p className="mt-4 text-xs text-[#7B8999]">
          Creative visual solutions.
        </p>

      </div>


      {/* Navigation */}

      <div className="flex flex-wrap gap-6">

        <a
          href="#work"
          className="text-xs font-bold text-[#5B6B7F] transition hover:text-[#00B8D9]"
        >
          Our Work
        </a>

        <a
          href="#about"
          className="text-xs font-bold text-[#5B6B7F] transition hover:text-[#00B8D9]"
        >
          About
        </a>

        <a
          href="#contact"
          className="text-xs font-bold text-[#5B6B7F] transition hover:text-[#00B8D9]"
        >
          Contact
        </a>

      </div>

    </div>


    {/* Bottom */}

    <div className="mt-10 flex flex-col justify-between gap-3 border-t border-[#071A2F]/10 pt-6 text-[10px] text-[#7B8999] sm:flex-row">

      <span>
        © {new Date().getFullYear()} RAED Advertising.
      </span>

      <span>
        Designed with RAED.
      </span>

    </div>

  </div>

</footer>

    </main>
  );
}