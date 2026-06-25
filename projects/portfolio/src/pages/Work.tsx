import { ContactForm } from "../components/ContactForm";
import { WorkCard } from "../components/WorkCard";
import { DotMask } from "../components/DotMask";

export function Work() {
  return (
    <div class="page">
      <DotMask scrollTrack={1} zones={[
        { cy: '15%', height: '400px', hideRadius: '25%', shiftRadius: '40%' },
        { cy: '45%', height: '400px', hideRadius: '25%', shiftRadius: '40%' },
        { cy: '75%', height: '400px', hideRadius: '25%', shiftRadius: '40%' },
        { cy: '105%', height: '400px', hideRadius: '25%', shiftRadius: '40%' },
        { cy: '140%', height: '400px', hideRadius: '25%', shiftRadius: '40%' },
      ]} />
      <h1>Work</h1>
      <p>Projects I&rsquo;ve built.</p>

      <div class="entry-list">
        <WorkCard
          title="Narration Fixer"
          tags={["Rust", "Tauri", "Preact", "Desktop", "Audio Engineering"]}
        >
          <p>
            Narrators face a massive bottleneck when dealing with raw audio. In a
            typical 100,000-word audiobook, mistakes are inevitable. This leaves
            the narrator with hours of tedious editing to ensure errors don&rsquo;t
            make the final cut&mdash;a costly step that often requires hiring an
            editor. Some narrators use clickers during recording to mark errors
            manually, but I wanted to build software that could find and erase
            these mistakes automatically.
          </p>
          <p>
            Commercial tools exist, but they require sending your audio and
            script to a company server. For many narrators, that data transfer
            isn&rsquo;t reasonable. I value privacy highly, so I designed my
            narration fixer to run entirely locally on the user&rsquo;s machine.
          </p>
          <p>
            Local execution at scale introduces major hurdles. Finding an
            isolated mistake is trivial: you pass the audio through an open-source
            AI transcription tool like Vosk and compare it to the script. The real
            difficulty lies in processing full-length books:
          </p>
          <p>
            <strong>Identifying the Right Take:</strong> Narrators often repeat a
            botched sentence multiple times to fix their tone. The software must
            identify these identical text sequences and keep only their final attempt.
          </p>
          <p>
            <strong>Handling Script Discrepancies:</strong> PDFs often contain
            unread formatting, headers, page numbers, or line-wrap hyphens that a
            naive text matcher would see as distinct words or mistakes.
          </p>
          <p>
            <strong>Local Performance:</strong> Processing large datasets on
            standard consumer laptops requires high efficiency.
          </p>
          <h3>Implementation</h3>
          <p>
            I built the desktop application using Tauri, which runs a local Rust
            backend connected to a lightweight Preact frontend. Rust was essential
            here; handling 200,000 words fluidly is practically impossible in
            JavaScript.
          </p>
          <p>
            To solve the text-alignment problem, I adapted the Needleman-Wunsch
            algorithm from bioinformatics, which is typically used for DNA
            sequence alignment. It treats text sequences as a path, applying
            penalties for mismatches to find the optimal path between the script
            and the AI transcript.
          </p>
          <p>
            However, standard Needleman-Wunsch operates in quadratic O(NM) time,
            which chokes on large books. To fix this, I optimized the algorithm
            using a banded dynamic programming approach. By restricting the search
            space to a localized band around timeline anchors, I dropped the
            runtime to roughly linear O(n) time. I also modified the pathing logic
            to recognize repetitions, ensuring it isolates and keeps only the
            final, corrected take. A 200,000-word script now processes in 1.6
            seconds on my machine, meaning even an older laptop can process book
            chapters in real time.
          </p>
          <p>
            Cleaning up messy PDFs meant hunting down layout edge cases. The tool
            filters out repeating headers, footers, and page numbers, and
            reconstructs words broken across line-break hyphens. For fiction books
            filled with made-up names and worlds, the system cross-references the
            script with Vosk&rsquo;s dictionary to dynamically generate a custom
            session dictionary, preventing false error flags.
          </p>
          <h3>What I Learned</h3>
          <p>
            This project pushed me on algorithmic complexity. My first prototype
            was written in JavaScript using a depth-first exhaustive search with
            caching. While it worked for short passages, a 10,000-word script
            completely exhausted JavaScript&rsquo;s maximum RAM allocation. That
            bottleneck forced me to pivot to Rust, where I rewrote the backend and
            integrated the Needleman-Wunsch approach.
          </p>
          <p>
            The biggest takeaway for me is that many computational problems are
            topologically indistinct. Finding an optimized solution in a completely
            unrelated field&mdash;like genetics&mdash;and adapting it to audio
            engineering yielded an incredibly elegant, performant tool. I&rsquo;m
            quite proud of this one!
          </p>
          <p>
            The Narration Fixer is still in development, but it will soon be available for download on desktop.
          </p>
        </WorkCard>

        <WorkCard
          title="Grapefruit"
          tags={["Capacitor", "React", "iOS", "Android"]}
        >
          <p>
            Grapefruit is a digital planning and life-organization app for iOS
            and Android that features weekly calendars, todo lists, and visual
            &ldquo;success maps&rdquo; to track goals.
          </p>
          <p>
            I inherited the codebase from a non-technical client who built the
            initial prototype using an AI coding assistant. While the core idea
            was sound and the app technically compiled, it suffered from three
            massive architectural flaws. First, it was built on Next.js&mdash;a
            framework designed for the web that requires strict static-export
            configurations to play nicely with mobile webviews. Second, key
            systems like data persistence and storage were completely broken;
            the client had reached a point where any new AI prompt broke
            existing features. Finally, the UI was designed strictly for
            desktop, leaving the mobile layout cramped and unusable.
          </p>
          <p>
            The codebase perfectly illustrated the pitfalls of unguided AI
            generation:
          </p>
          <p>
            <strong>Redundant Data Models:</strong> TypeScript interfaces were
            copy-pasted across four different files alongside the canonical
            types.ts, and the initial app state was duplicated with conflicting
            configurations.
          </p>
          <p>
            <strong>Dead Code:</strong> The repository contained hundreds of
            lines of dead code, including a 130-line &ldquo;compilation
            test&rdquo; file that was never imported and a massive migration
            utility that the app didn&rsquo;t use.
          </p>
          <p>
            <strong>Monolithic Components:</strong> Pages were generated as
            massive, single-file blocks&mdash;like a 766-line reading
            page&mdash;because the AI was never prompted to architect clean
            abstractions.
          </p>
          <p>
            AI is excellent for rapid prototyping, but it doesn&rsquo;t know
            when to stop adding to a file or when to reuse an existing system.
            Digging through it stretched my code comprehension skills; as it
            turns out, untangling bad code is often harder than writing good
            code from scratch.
          </p>
          <h3>Implementation</h3>
          <p>
            My job was to systematically refactor the mess. I modularized the
            monolithic components, unified the duplicate type definitions, and
            designed a responsive mobile layout. To fix the broken data layer,
            I ripped out the conflicting implementations and built a clean,
            centralized persistence system. Ironically, I used AI to accelerate
            a lot of these targeted refactoring edits.
          </p>
          <p>
            To bridge the web-to-mobile gap, I used Capacitor to wrap the React
            application into native iOS and Android binaries. While webviews get
            a bad reputation for performance, Capacitor is the ideal pragmatic
            tool for a data-entry and productivity app of this scale. The bulk
            of the remaining engineering effort was spent modifying the
            application to comply with the rigid production requirements of the
            Apple App Store and Google Play Store.
          </p>
          <h3>What I Learned</h3>
          <p>
            With all the focus on AI technical debt, you would think the
            takeaway here was about the dangers of non-technical prompt
            engineering. Instead, the biggest bottleneck in the entire project
            turned out to be the App Store review and deployment pipelines.
          </p>
          <p>
            If I could redo this project, I would submit a bare-bones build to
            Apple and Google on day one. Navigating store rejections and
            compliance guidelines late in the cycle taught me that deployment
            logistics can impact your timeline just as much as rewriting a
            broken architecture.
          </p>
        </WorkCard>

        <WorkCard
          title="Mind"
          tags={["React Native", "Mobile Development", "Cybersecurity", "Local-First"]}
        >
          <p>
            Mind is a mobile journal app built on the premise that strict
            encryption should be a modern requirement rather than an
            afterthought. It allows users to manage multiple journals (with
            some fun customizable themes), securing all local data using
            AES-256 encryption. The architecture prioritizes a high standard
            of privacy: the moment the app loses focus or is backgrounded, all
            decrypted data is immediately wiped from memory, requiring the
            user to re-enter their password to access it again.
          </p>
          <h3>Implementation</h3>
          <p>
            Mind was originally built using Expo but is currently being
            migrated directly to bare React Native to allow for tighter
            control over secure storage modules.
          </p>
          <p>
            To prevent data loss without compromising privacy, I implemented
            cloud backup integrations with Google Drive and Dropbox. The app
            uses a zero-knowledge architecture&mdash;encrypting the database
            locally on the device before uploading it&mdash;ensuring that
            cloud providers only ever store unreadable blobs and that the
            user&rsquo;s device remains the sole holder of the decryption key.
          </p>
          <p>
            Aside from security, a major focus was creating a radically
            minimalist user experience. I wanted virtually nothing on the
            screen except the text when a journal is open. Achieving this look
            required moving away from traditional, blocky mobile UI components
            and iterating through several design cycles until the interface
            felt completely seamless and distraction-free.
          </p>
          <h3>What I Learned</h3>
          <p>
            Mind was my introduction to managing deployment pipelines on the
            Google Play Store. It was also the first project where I had to
            build a complete design specification from scratch rather than
            working from an existing template. Balancing the strict constraints
            of data security with an ultra-lightweight user experience taught
            me a lot about product design, and it reinforced how rewarding it
            is to build tools that solve real-world problems for privacy-conscious
            users.
          </p>
          <p>
            Mind is currently in active development, and you can review the
            codebase directly on <a href="https://github.com/TraverserEternal/Mind" target="_blank" rel="noopener noreferrer">GitHub</a>.
          </p>
        </WorkCard>

        <WorkCard
          title="dallinbradford.com"
          tags={["Preact", "AWS", "Serverless", "Web Development"]}
        >
          <p>
            Dallin Bradford is a successful audiobook narrator who approached me
            to build a portfolio website that showcases his work and gives new
            clients a direct way to contact him. He also happens to be my
            brother, so I was more than happy to take on the project.
          </p>
          <p>
            When designing the site, we focused on two main priorities:
          </p>
          <p>
            <strong>The layout</strong> relies on clean typography and clear
            components, naturally guiding the user through his portfolio down to
            the contact form at the bottom of the page.
          </p>
          <p>
            <strong>All animations</strong> are designed to be sleek but
            minimal. We wanted the site to feel modern and professional without
            distracting from the main focus: his audio samples.
          </p>
          <h3>Implementation</h3>
          <p>
            The site is built using Preact, which keeps the client bundle
            incredibly small and allows the page to load almost instantly. For
            the backend and hosting, I chose a serverless architecture on AWS.
            By serving the site as a static build through a content delivery
            network, operating costs are kept down to pennies a month since
            there is no traditional server running constantly.
          </p>
          <p>
            Image optimization was another critical piece of the architecture.
            To ensure fast mobile loading times without sacrificing visual
            quality, all images are compressed specifically for web delivery,
            keeping the portfolio sharp on high-resolution displays while
            minimizing data usage.
          </p>
          <h3>What I Learned</h3>
          <p>
            Building a site for a real-world client always highlights the most
            important part of web development. Technical optimizations&mdash;like
            mobile responsiveness or hitting record-breaking load times (which
            Preact handles beautifully)&mdash;are salient topics in web dev. In
            the end, however, the most worthwhile part of any software is the
            actual value it brings to the person using it. Truly understanding
            the business intent behind a project is vital to software
            development.
          </p>
          <p>
            You can visit <a href="https://dallinbradford.com" target="_blank" rel="noopener noreferrer">dallinbradford.com</a> to see the live site.
          </p>
        </WorkCard>
      </div>

      <section class="contact-section">
        <h2>Interested in working together?</h2>
        <p>Let&rsquo;s talk about your next project.</p>
        <ContactForm />
      </section>
    </div>
  );
}
