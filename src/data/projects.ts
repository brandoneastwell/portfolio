import sivterDemo from "../assets/landing-demo.gif";
import raDemo from "../assets/ra-demo.gif";
import lrsDemo from "../assets/lrs-services.vercel.app_(iPhone 14 Pro Max).png";
import photoappDemo from "../assets/photoapp-cover.gif";
import outdoorReflectionsDemo from "../assets/outdoor-reflections-page.png";

interface Project {
    slug: string;
    title: string;
    description: string;
    img: string;
    gitUrl: string;
    liveUrl?: string;
    tools: string[];
    toolBackground: string;
    edgeColor?: string;
}

export const projects: Project[] = [
    {
        slug: "outdoor-reflections",
        title: "Outdoor Reflections",
        description: "Offline-first hiking journal with IndexedDB autosave and background sync API for notes and sketches so edits survive a lost connection. I also implemented client-side entry encryption, JWT-based account authentication, and a FastAPI AI service that generates writing suggestions based on themes from earlier reflections.",
        img: outdoorReflectionsDemo.src,
        gitUrl: "https://github.com/brandoneastwell/outdoor-reflections",
        liveUrl: "https://outdoor-reflections.com",
        tools: ["React", "TypeScript", "Next.js", "NestJS", "IndexedDB", "PostgreSQL", "FastAPI", ],
        toolBackground: "#852b3c",
        edgeColor: "#862d41",
    },
    {
        slug: "photography-app",
        title: "Photography Sharing & Search",
        description: "I built an upload flow that reads camera settings from photo metadata, then used GeoDjango and PostGIS to let users find photos by equipment, exposure settings and distance.",
        img: photoappDemo.src,
        gitUrl: "https://github.com/brandoneastwell/photography-app",
        liveUrl: "https://photosmap.co.uk",
        tools: ["React Native", "Expo", "TypeScript", "GeoDjango", "PostGIS"],
        toolBackground: "#30333a",
    },
    {
        slug: "sivter",
        title: "Sivter Movie Discovery",
        description: "I integrated the TMDB API to bring film search and streaming availability into one place. I built authenticated favourites and watchlists backed by Prisma and PostgreSQL.",
        img: sivterDemo.src,
        gitUrl: "https://github.com/brandoneastwell/movie-discovery-app",
        liveUrl: "https://sivter-app.vercel.app/",
        tools: ["Next.js", "React", "TypeScript", "Prisma", "PostgreSQL"],
        toolBackground: "#4c357a",
    },
    {
        slug: "ra-set-finder",
        title: "RA Set Finder",
        description: "I extracted DJ lineups from Resident Advisor pages and proxied YouTube searches through Express to keep the API key server-side. I cached results in browser storage to avoid repeat requests.",
        img: raDemo.src,
        gitUrl: "https://github.com/brandoneastwell/ra-set-finder",
        tools: ["React", "TypeScript", "Express", "Chrome Extension"],
        toolBackground: "#a1232d",
    },
    {
        slug: "lrs-exterior-services",
        title: "LRS Exterior Services",
        description: "I built a React quote form and an Express endpoint that validates required fields and emails enquiries to the business. I also built an interactive before-and-after photo carousel.",
        img: lrsDemo.src,
        gitUrl: "https://github.com/brandoneastwell/lrs-services",
        liveUrl: "https://lrs-services.vercel.app/",
        tools: ["React", "TypeScript", "Tailwind CSS", "Express", "Nodemailer"],
        toolBackground: "#18567b",
    },
];
