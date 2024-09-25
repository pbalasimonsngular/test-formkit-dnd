"use client";

import { animations, multiDrag, selections } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

import data from "../data/names.json";

import styles from "./page.module.scss";
import { useEffect, useRef } from "react";
import { useIntersectionObserver } from "./hooks/useIntersectionObserver";

interface Name {
  name: string;
}

export default function Home() {
  const NAMES_PER_PAGE = 12;

  const initialNames: Name[] = data;

  const names = initialNames.slice(0, NAMES_PER_PAGE);

  const selectedClass = `${styles.selected}`;

  const [parent, namesDND, updateNamesDND] = useDragAndDrop<
    HTMLUListElement,
    Name
  >(names, {
    plugins: [
      animations(),
      multiDrag({
        plugins: [
          selections({
            selectedClass,
          }),
        ],
      }),
    ],
  });

  const loadMoreResultsRef = useRef<HTMLDivElement>(null);

  const entry = useIntersectionObserver(loadMoreResultsRef, {});

  const loadMoreNames = () => {
    const start = namesDND.length;
    const end = start + NAMES_PER_PAGE;
    const newProducts = initialNames.slice(start, end);
    updateNamesDND([...namesDND, ...newProducts]);
  };

  useEffect(() => {
    if (entry?.isIntersecting) {
      loadMoreNames();
    }
  }, [entry?.isIntersecting]);

  return (
    <div className={styles.container}>
      <button onClick={() => loadMoreNames()}>LOAD MORE NAMES</button>
      <ul className={`${styles.grid}`} ref={parent}>
        {namesDND?.map(({ name }: Name, index: number) => (
          <li className={styles.name} key={index}>
            <span>
              {index + 1} - {name}
            </span>
          </li>
        ))}
      </ul>
      <div role="presentation" ref={loadMoreResultsRef} />
    </div>
  );
}
