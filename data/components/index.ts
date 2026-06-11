import type { Component } from "@/lib/types";
import { gpus } from "./gpu";
import { cpus } from "./cpu";
import { ram } from "./ram";
import { ssds } from "./ssd";
import { hdds } from "./hdd";
import { usbs } from "./usb";
import { psus } from "./psu";
import { mobos } from "./mobo";
import { cases } from "./case";
import { coolers } from "./cooler";

/** כל הרכיבים מכל הקטגוריות, מאוחדים. */
export const ALL_COMPONENTS: Component[] = [...gpus, ...cpus, ...ram, ...ssds, ...hdds, ...usbs, ...psus, ...mobos, ...cases, ...coolers];

export { gpus, cpus, ram, ssds, hdds, usbs, psus, mobos, cases, coolers };
