"use client";
import React, { memo, useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/card/card";
import { ContainerScroll } from "../ui/ipad";
import Image from "next/image";
import { Timeline } from "../ui/timeline";
import { motion } from "framer-motion";
import Link from "next/link";

interface Project {
  id: number;
  name: string;
  images: string[];
  techs: { name: string; description: string }[];
  liveLink?: string;
  githubLink?: string;
}

interface CardStuffProps {
  projects: Project[];
}

export const CardStuff: React.FC<CardStuffProps> = memo(({ projects }) => {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Memoize the current project's images and techs to prevent unnecessary re-renders
  const currentProject = projects[currentProjectIndex];

  useEffect(() => {
    // Set up an interval to change the image every 4 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === currentProject.images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [currentProject]);

  const data = useMemo(
    () =>
      currentProject.techs.map((tech) => ({
        title: tech.name,
        content: tech.description,
      })),
    [currentProject]
  );

  const handleProjectClick = useCallback((projectIndex: number) => {
    setCurrentProjectIndex(projectIndex);
    setCurrentImageIndex(0); // Reset image index when switching projects
  }, []);

  return (
    <>
      <Card className="w-[70rem] h-[40rem]">
        <CardHeader>
          <CardTitle>
            <div className="space-x-4">
              {projects.map((project, projectIndex) => (
                <Button
                  variant={"gradient"}
                  key={project.id}
                  onClick={() => handleProjectClick(projectIndex)}
                >
                  {project.name}
                </Button>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <div className="h-px w-full bg-gradient-to-r from-white via-black to-white"></div>
        <CardContent>
          <div className="-ml-24 mt-4 flex">
            <ContainerScroll>
              <motion.div
                key={currentProject.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ ease: "linear" }}
              >
                {currentProject.githubLink ? (
                  <Link href={currentProject.githubLink} passHref>
                    <Image
                      src={`/${currentProject.images[currentImageIndex]}`}
                      alt="project image"
                      height={540}
                      width={1050}
                      className="rounded-md"
                      draggable={false}
                    />
                  </Link>
                ) : (
                  <Image
                    src={`/${currentProject.images[currentImageIndex]}`}
                    alt="project image"
                    height={540}
                    width={1050}
                    className="rounded-md"
                    draggable={false}
                  />
                )}
              </motion.div>
            </ContainerScroll>
            <div className="h-[30rem] overflow-scroll scrollbar-hide mt-5 ml-16">
              <Timeline data={data} />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
});
