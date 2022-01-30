import {Theme} from "~types";

const theme: Omit<Theme, "name"> = {
    // app
    "timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",

    // button
    "button-padding": "1rem",
    "button-size": "2.5rem",

    // input
    "input-min-width": "14rem",
    "input-padding": "0.75rem",
    "input-size": "2.5rem",

    // label
    "label-size": "2.5rem",

    // list
    "list-padding": "1rem",

    // main
    "main-block-margin": "2rem",
    "main-padding": "2.5rem",

    // modal
    "modal-dialog-padding": "2rem",

    // sidebar
    "sidebar-button-size": "2.75rem",
    "sidebar-padding": "1rem",
    "sidebar-size": "20rem",

    // tablist
    "tablist-size": "3rem",

    // toolbar
    "toolbar-size": "3.5rem",

    // tooltip
    "tooltip-padding": "0.5rem",
};

export default theme;
