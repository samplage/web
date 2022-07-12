import {
  Navbar,
  Button,
  Flowbite,
  DarkThemeToggle,
  Card,
  TextInput,
} from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { useOptionalUser } from "~/utils";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getSamples } from "~/models/sample.server";

import AudioPlayer from "react-h5-audio-player";

import type { LoaderFunction } from "@remix-run/node";

type LoaderData = {
  samples: Awaited<ReturnType<typeof getSamples>>;
};

export const loader: LoaderFunction = async () => {
  const samples = await getSamples();
  return json<LoaderData>({ samples });
};

export default function Index() {
  const user = useOptionalUser();
  const data = useLoaderData() as LoaderData;

  return (
    <Flowbite>
      <Navbar fluid={true}>
        <Navbar.Brand href="https://samplage.com/">
          <svg
            className="mr-3 h-6 sm:h-9"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
          >
            <path d="M224 96C206.3 96 192 110.3 192 127.1v256C192 401.7 206.3 416 223.1 416S256 401.7 256 384V127.1C256 110.3 241.7 96 224 96zM32 224C14.33 224 0 238.3 0 255.1S14.33 288 31.1 288S64 273.7 64 256S49.67 224 32 224zM320 0C302.3 0 288 14.33 288 31.1V480C288 497.7 302.3 512 319.1 512S352 497.7 352 480V31.1C352 14.33 337.7 0 320 0zM128 192C110.3 192 96 206.3 96 223.1V288C96 305.7 110.3 320 127.1 320S160 305.7 160 288V223.1C160 206.3 145.7 192 128 192zM608 224c-17.67 0-32 14.33-32 31.1S590.3 288 608 288s32-14.33 32-31.1S625.7 224 608 224zM416 128C398.3 128 384 142.3 384 159.1v192C384 369.7 398.3 384 415.1 384S448 369.7 448 352V159.1C448 142.3 433.7 128 416 128zM512 64c-17.67 0-32 14.33-32 31.1V416C480 433.7 494.3 448 511.1 448C529.7 448 544 433.7 544 416V95.1C544 78.33 529.7 64 512 64z" />
          </svg>
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Samplage
          </span>
        </Navbar.Brand>
        <div className="flex space-x-2 md:order-2">
          <DarkThemeToggle />
          <Button>Sign in</Button>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link href="./">Movie Quotes</Navbar.Link>
          <Navbar.Link href="./">Trailer Quotes</Navbar.Link>
          <Navbar.Link href="./">TV Quotes</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
      <div className="mx-auto flex max-w-4xl flex-col space-y-4">
        {/* <TextInput
          id="search"
          type="search"
          placeholder="Search Samples"
          icon={HiSearch}
        /> */}

        {data.samples.length === 0 ? (
          <p className="p-4">No notes yet</p>
        ) : (
          <div className="flex flex-col space-y-4 ">
            {data.samples.map((note) => (
              <Card
                key={note.id}
                horizontal={true}
                imgSrc="./assets/2006_rocky_balboa_046.jpg"
                style={{ maxWidth: "100%" }}
              >
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {note.title}
                </h5>
                <AudioPlayer src="./assets/rocky_balboa-it_aint_about_how_hard_you_hit.mp3" />
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {note.transcript}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Flowbite>
  );
}
