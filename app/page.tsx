import Image from "next/image";

/* =========================================================
   CLOUDINARY ASSETS
   ضع روابطك هنا
   ========================================================= */

const BRAND_LOGO_URL = "https://raw.githubusercontent.com/Merdo240/Raed-portfolio/main/assets/Logo.png";
const HOME_HERO_IMAGE_URL = "";
const HOME_DECORATION_URL = "";

/* =========================================================
   HOME PAGE
   ========================================================= */

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F9FC] text-[#071A2F]">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="absolute left-0 right-0 top-0 z-50">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">

          {/* Brand */}

          <a
            href="/"
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
              href="/"
              className="text-sm font-bold text-[#00B8D9]"
            >
              Home
            </a>

            <a
              href="/portfolio"
              className="text-sm font-semibold text-[#071A2F] transition hover:text-[#00B8D9]"
            >
              Portfolio
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

      <section className="relative min-h-screen overflow-hidden pt-32">

        {/* =================================================
            BACKGROUND
            ================================================= */}

        <div className="absolute inset-0">

          {/* Cyan glow */}

          <div className="absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-[#00B8D9]/10 blur-3xl" />


          {/* Navy glow */}

          <div className="absolute right-[-180px] top-[-100px] h-[600px] w-[600px] rounded-full bg-[#123B70]/10 blur-3xl" />


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


          {/* Decorative circle */}

          <div className="absolute left-[7%] top-[25%] h-3 w-3 rounded-full bg-[#00B8D9]" />

        </div>


        <div className="relative mx-auto grid min-h-[calc(100vh-100px)] max-w-7xl items-center gap-16 px-6 pb-20 lg:grid-cols-2 lg:px-8">


          {/* =================================================
              HERO CONTENT
              ================================================= */}

          <div className="relative z-10 max-w-2xl">

            {/* Label */}

            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#00B8D9]/20 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">

              <span className="h-2 w-2 rounded-full bg-[#00B8D9]" />

              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#123B70]">
                Creative Advertising & Design
              </span>

            </div>


            {/* Heading */}

            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.045em] text-[#071A2F] sm:text-6xl lg:text-7xl">

              We turn ideas

              <span className="mt-3 block text-[#123B70]">
                into
              </span>

              <span className="relative mt-1 block text-[#00B8D9]">

                visual impact.

                <span className="absolute -bottom-3 left-0 h-1 w-20 rounded-full bg-[#071A2F]" />

              </span>

            </h1>


            {/* Description */}

            <p className="mt-9 max-w-xl text-base leading-8 text-[#5B6B7F] sm:text-lg">
              RAED Advertising creates modern visual experiences,
              advertising designs and creative solutions that help
              brands communicate with impact.
            </p>


            {/* Buttons */}

            <div className="mt-9 flex flex-wrap gap-4">

              <a
                href="/portfolio"
                className="group inline-flex items-center gap-3 rounded-lg bg-[#071A2F] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-[#071A2F]/10 transition-all duration-300 hover:-translate-y-1 hover:bg-[#123B70]"
              >

                Explore Our Work

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>

              </a>


              <a
                href="#contact"
                className="inline-flex items-center rounded-lg border border-[#071A2F]/10 bg-white px-7 py-4 text-sm font-bold text-[#071A2F] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00B8D9] hover:text-[#00B8D9]"
              >
                Start a Project
              </a>

            </div>


            {/* Small stats */}

            <div className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-[#071A2F]/10 pt-7">

              <div>

                <div className="text-xl font-black text-[#071A2F]">
                  RAED
                </div>

                <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#7B8999]">
                  Advertising
                </div>

              </div>


              <div>

                <div className="text-xl font-black text-[#071A2F]">
                  01
                </div>

                <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#7B8999]">
                  Creative Studio
                </div>

              </div>


              <div>

                <div className="text-xl font-black text-[#071A2F]">
                  24/7
                </div>

                <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#7B8999]">
                  Work Times
                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              HERO VISUAL
              ================================================= */}

          <div className="relative hidden h-[600px] lg:block">


            {/* Decorative Cloudinary image */}

            {HOME_DECORATION_URL && (

              <img
                src={HOME_DECORATION_URL}
                alt=""
                className="absolute -right-10 top-4 z-30 h-36 w-36 object-contain"
              />

            )}


            {/* Back card */}

            <div className="absolute right-12 top-14 h-[470px] w-[360px] rotate-6 rounded-[30px] bg-[#123B70] shadow-xl" />


            {/* Main card */}

            <div className="absolute right-20 top-8 h-[480px] w-[360px] overflow-hidden rounded-[30px] bg-[#071A2F] shadow-[0_30px_80px_rgba(7,26,47,0.25)]">


              {/* Main image */}

              {HOME_HERO_IMAGE_URL ? (

                <img
                  src={HOME_HERO_IMAGE_URL}
                  alt="RAED Advertising"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
                />

              ) : (

                <div className="absolute inset-0">

                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[280px] font-black leading-none text-white/[0.045]">
                    R
                  </div>

                  <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00B8D9]/20 bg-[#00B8D9]/10 shadow-[0_0_80px_rgba(0,184,217,0.35)]" />

                  <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00B8D9]" />

                </div>

              )}


              {/* Overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-[#071A2F] via-[#071A2F]/10 to-transparent" />

              <div className="absolute inset-0 bg-gradient-to-br from-[#00B8D9]/10 via-transparent to-transparent" />


              {/* Top label */}

              <div className="absolute left-7 top-7 z-20">

                <div className="rounded-full border border-white/15 bg-black/20 px-4 py-2 backdrop-blur-md">

                  <div className="flex items-center gap-2">

                    <span className="h-1.5 w-1.5 rounded-full bg-[#00B8D9]" />

                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/80">
                      RAED Advertising
                    </span>

                  </div>

                </div>

              </div>


              {/* Bottom */}

              <div className="absolute bottom-0 left-0 right-0 z-20 p-8">

                <div className="mb-4 h-1 w-12 rounded-full bg-[#00B8D9]" />

                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#00B8D9]">
                  Creative Advertising
                </div>

                <h3 className="mt-2 text-3xl font-black text-white">
                  Visual Impact.
                </h3>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">

                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                    RAED Advertising
                  </span>

                  <span className="text-lg text-white">
                    ↗
                  </span>

                </div>

              </div>

            </div>


            {/* Floating logo */}

            <div className="absolute bottom-16 left-0 z-40">

              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-white bg-white p-4 shadow-2xl">

                {BRAND_LOGO_URL ? (

                  <img
                    src={BRAND_LOGO_URL}
                    alt="RAED Advertising"
                    className="h-full w-full object-contain"
                  />

                ) : (

                  <div className="text-5xl font-black text-[#071A2F]">
                    R<span className="text-[#00B8D9]">.</span>
                  </div>

                )}

              </div>

            </div>


            {/* Floating badge */}

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


            {/* Dots */}

            <div className="absolute left-14 top-20 z-20 grid grid-cols-3 gap-2">

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
          NEXT SECTION PLACEHOLDER
          ===================================================== */}

      <section
        id="about"
        className="border-t border-[#071A2F]/10 bg-white py-28"
      >

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="max-w-2xl">

            <div className="mb-5 flex items-center gap-3">

              <span className="h-px w-10 bg-[#00B8D9]" />

              <span className="text-xs font-black uppercase tracking-[0.3em] text-[#00B8D9]">
                About RAED
              </span>

            </div>

            <h2 className="text-4xl font-black tracking-tight text-[#071A2F] sm:text-5xl">
              Creative ideas.
              <span className="block text-[#00B8D9]">
                Clear communication.
              </span>
            </h2>

            <p className="mt-6 text-base leading-8 text-[#5B6B7F]">
              RAED Advertising creates modern visual solutions for brands,
              businesses and creative projects.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTACT
          ===================================================== */}

      <section
        id="contact"
        className="bg-[#F7F9FC] py-24"
      >

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="overflow-hidden rounded-[28px] bg-[#00B8D9] p-10 sm:p-14">

            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#071A2F]/60">
              Let's work together
            </span>

            <h2 className="mt-4 text-4xl font-black text-[#071A2F] sm:text-5xl">
              Have a project in mind?
            </h2>

            <a
              href="https://wa.me/967770282271"
              className="mt-8 inline-flex rounded-lg bg-[#071A2F] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#123B70]"
            >
              Get in touch →
            </a>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="border-t border-[#071A2F]/10 bg-white py-8">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 text-center sm:flex-row sm:text-left lg:px-8">

          <div className="font-black text-[#071A2F]">
            RAED Advertising
          </div>

          <div className="text-xs text-[#7B8999]">
            © {new Date().getFullYear()} RAED Advertising. All rights reserved.
          </div>

        </div>

      </footer>

    </main>
  );
}