import { useState, useRef, useEffect } from "react";
import { useMediaQuery } from "./util/useMediaQuery";

function App() {
    // Do I need to update the UI when any of these change? if so, then useState is correct, if not then you dont need a useState variable for it, normal variable would be better
    const matches = useMediaQuery("(min-width: 800px)");
    const [navToggled, setNavToggled] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);
    const [pledge, setPledge] = useState(0);
    const [pledgeAmount, setPledgeAmount] = useState(0);
    const [pledgeSubmitted, setPledgeSubmitted] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [bambooStock, setBambooStock] = useState(101);
    const [blackEditionStock, setBlackEditionStock] = useState(64);
    const [mahoganyStock, setMahoganyStock] = useState(0);
    // Would these do better as a useRef so we don't cause a re-render on each keystroke? or is it fine as a useState?
    const [totalAmountRaised, setTotalAmountRaised] = useState(
        parseInt(localStorage.getItem("totalAmount")) || 0
    );
    const [totalBackers, setTotalBackers] = useState(5007);
    const [daysLeft, setDaysLeft] = useState(56);

    const max = 100000;
    let percentage = Math.trunc((totalAmountRaised / max) * 100);
    console.log(percentage);
    console.log(totalAmountRaised);

    const modalRef = useRef(null);

    const openModal = () => {
        if (modalRef.current) {
            modalRef.current.showModal();
            setModalOpened(true);
        }
    };

    const closeModal = () => {
        if (modalRef.current) {
            modalRef.current.close();
            setModalOpened(false);
        }
        setPledgeSubmitted(false);
    };

    const handleSelectRewardClick = (id) => {
        setPledge(id);
        openModal();

        // We need setTimeout because the modal opens too fast and the scrollIntoView will already be executed before the modal is opened so it wont work, we delay the scrollIntoView so the modal fully opens then it scrolls
        setTimeout(() => {
            const noneSection = document.getElementById("none");
            const bambooSection = document.getElementById("bamboo");
            const blackEditionSection = document.getElementById("blackEdition");
            const mahoganySection = document.getElementById("mahogany");

            if (id === 0) {
                noneSection.scrollIntoView({
                    behavior: "smooth", // Add smooth scrolling animation
                    block: "center", // Scroll to the center of the element
                });
            }

            if (id === 1) {
                bambooSection.scrollIntoView({
                    behavior: "smooth", // Add smooth scrolling animation
                    block: "center", // Scroll to the center of the element
                });
            }

            if (id === 2) {
                blackEditionSection.scrollIntoView({
                    behavior: "smooth", // Add smooth scrolling animation
                    block: "center", // Scroll to the center of the element
                });
            }

            if (id === 3) {
                mahoganySection.scrollIntoView({
                    behavior: "smooth", // Add smooth scrolling animation
                    block: "center", // Scroll to the center of the element
                });
            }
        }, 500);
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        closeModal();
        setTotalAmountRaised((prev) => prev + parseInt(pledgeAmount));
        setTotalBackers((prev) => (prev += 1));
        // common React problem: if you try putting the totalAmountRaised in the local storage here then it won't update because React is asychronous meaning the code will reach this line before the state is updated, so we need to use useEffect to listen for changes in the totalAmountRaised state and then update the local storage
        // localStorage.setItem("totalAmount", totalAmountRaised);

        if (pledge === 1) {
            setBambooStock((prev) => prev - 1);
        } else if (pledge === 2) {
            setBlackEditionStock((prev) => prev - 1);
        } else if (pledge === 3) {
            setMahoganyStock((prev) => prev - 1);
        }
    };

    useEffect(() => {
        localStorage.setItem("totalAmount", totalAmountRaised);
    }, [totalAmountRaised]);

    // Without the useEffect the when closing the modal with the escape key the modalOpened state is not updated and the hidden class wont be applied making it visible
    useEffect(() => {
        const handleEscapeKeyPress = (event) => {
            if (event.key === "Escape" && modalOpened) {
                closeModal();
            }
        };

        // Add the event listener when the modal is opened
        if (modalOpened) {
            document.addEventListener("keydown", handleEscapeKeyPress);
        } else {
            document.removeEventListener("keydown", handleEscapeKeyPress);
        }

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener("keydown", handleEscapeKeyPress);
        };
    }, [modalOpened]);

    return (
        <>
            <div
                className={`overlay | z-50 fixed h-full aspect-square bg-black bg-opacity-30 ${
                    !navToggled ? "hidden" : ""
                }`}
            ></div>
            <header className="primary-header | desktop:px-8 h-80 font-primary flex justify-between bg-primary-header-mobile bg-no-repeat bg-center bg-cover desktop:bg-primary-header-desktop">
                <a className="site-logo | m-8 h-[min-content]" href="/">
                    <img src="/images/logo.svg" alt="crowdfund" />
                </a>
                <button
                    className="mobile-nav-toggle | desktop:hidden fixed top-8 right-8 scale-125 z-[9999]"
                    aria-controls="primary-nav-list"
                    aria-expanded={`${navToggled}`}
                    onClick={() => setNavToggled((prev) => !prev)}
                >
                    <img src="/images/icon-hamburger.svg" alt="" />
                    <span className="sr-only">Menu</span>
                </button>
                <nav className="primary-nav">
                    <ul
                        className={`primary-nav-list | fixed top-24 right-8 left-8 desktop:static bg-nuetral-100 desktop:bg-transparent flex flex-col desktop:flex-row rounded-xl text-nuetral-900 desktop:text-nuetral-100 font-bold desktop:font-regular text-lg desktop:text-base z-[1000] ${
                            !navToggled ? "hidden desktop:flex" : ""
                        }`}
                        id="primary-nav-list"
                        data-visible={`${navToggled}`}
                    >
                        <li className="border-b desktop:border-none border-solid border-nuetral-700 p-6">
                            <a className="hover:opacity-60" href="#">
                                About
                            </a>
                        </li>
                        <li className="border-b desktop:border-none border-solid border-nuetral-700 p-6">
                            <a className="hover:opacity-60" href="#">
                                Discover
                            </a>
                        </li>
                        <li className="border-b desktop:border-none border-solid border-nuetral-700 p-6">
                            <a className="hover:opacity-60" href="#">
                                Get Started
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>

            <main>
                <dialog
                    ref={modalRef}
                    id="modal"
                    className={`${
                        !modalOpened ? "hidden" : ""
                    } backdrop:bg-black backdrop:bg-opacity-40 mx-6 desktop:mx-auto max-w-[45rem] fixed top-8 p-6 rounded-xl grid gap-8 border-2 z-50`}
                >
                    {!pledgeSubmitted ? (
                        <>
                            <div>
                                <div className="flex items-center justify-between">
                                    <h2 className="font-bold text-lg">
                                        Back this project
                                    </h2>
                                    <img
                                        src="/images/icon-close-modal.svg"
                                        alt=""
                                        className="cursor-pointer"
                                        onClick={closeModal}
                                    />
                                </div>
                                <p className="text-nuetral-700 mt-4">
                                    Want to support is in Mastercraft Bamboo
                                    Moniter Riser out in the world?
                                </p>
                            </div>

                            <form action="#" method="dialog">
                                <ul className="grid gap-8">
                                    <li
                                        className={`grid gap-4 py-6 desktop:py-8 border border-nuetral-700 border-opacity-20 rounded-xl data-[selected='true']:border-2 data-[selected='true']:border-primary-400`}
                                        data-selected={`${
                                            pledge === 0 ? "true" : "false"
                                        }`}
                                        id="none"
                                    >
                                        <label
                                            htmlFor="option-1"
                                            className="cursor-pointer hover:text-primary-400"
                                        >
                                            <div className="flex gap-4 px-6">
                                                <input
                                                    type="radio"
                                                    name="option"
                                                    id="option-1"
                                                    checked={pledge === 0}
                                                    onChange={() =>
                                                        setPledge(0)
                                                    }
                                                    className="scale-150 cursor-pointer"
                                                />
                                                <h3 className="font-bold">
                                                    Pledge with no reward
                                                </h3>
                                            </div>

                                            <p className="text-nuetral-700 mt-8 desktop:mt-4 px-6">
                                                Choose to support us without a
                                                reward if you simply believe in
                                                our project. As a backer, you
                                                will be signed up to recieve
                                                product updates via email.
                                            </p>
                                        </label>

                                        <div
                                            className={`${
                                                pledge === 0
                                                    ? "border-t border-nuetral-700 border-opacity-20 desktop:flex"
                                                    : "hidden"
                                            } p-6 desktop:px-6 desktop:pt-6 desktop:py-0 text-center desktop:items-center desktop:justify-between`}
                                        >
                                            <p className="text-nuetral-700">
                                                Enter your pledge
                                            </p>
                                            {/* FIXME: MARKER */}
                                            <div className="flex items-center gap-4 mt-6 desktop:m-0">
                                                <div className="after:content-['$'] after:text-nuetral-700 after:font-bold after:block relative after:absolute after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:left-4">
                                                    <input
                                                        type="text"
                                                        placeholder="25"
                                                        onChange={(e) =>
                                                            setPledgeAmount(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="focus-visible:outline-primary-400 w-full desktop:w-24 outline-none font-bold outline outline-1 outline-nuetral-700 rounded-full py-3 pl-7"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    className="bg-primary-400 text-nuetral-100 font-medium rounded-full px-6 desktop:px-10 py-4 hover:bg-primary-500"
                                                    onClick={() =>
                                                        setPledgeSubmitted(true)
                                                    }
                                                >
                                                    Continue
                                                </button>
                                            </div>
                                        </div>
                                    </li>

                                    <li
                                        className={`${
                                            bambooStock <= 0 ? "opacity-40" : ""
                                        } grid gap-4 py-6 desktop:py-8 border border-nuetral-700 border-opacity-20 rounded-xl data-[selected='true']:border-2 data-[selected='true']:border-primary-400`}
                                        data-selected={`${
                                            pledge === 1 ? "true" : "false"
                                        }`}
                                        id="bamboo"
                                    >
                                        <label
                                            htmlFor="option-2"
                                            className="cursor-pointer hover:text-primary-400"
                                        >
                                            <div className="flex justify-between px-6">
                                                <div className="flex gap-4 items-center">
                                                    <input
                                                        type="radio"
                                                        name="option"
                                                        id="option-2"
                                                        checked={pledge === 1}
                                                        onChange={() =>
                                                            setPledge(1)
                                                        }
                                                        className="scale-150 cursor-pointer"
                                                        disabled={
                                                            bambooStock <= 0
                                                        }
                                                    />
                                                    <div className="flex flex-col desktop:flex-row desktop:gap-4">
                                                        <h3 className="font-bold">
                                                            Bamboo Stand
                                                        </h3>
                                                        <p className="text-primary-400 font-medium">
                                                            Pledge $25 or more
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="hidden desktop:block text-nuetral-900 font-bold text-xl">
                                                    {bambooStock}{" "}
                                                    <span className="text-nuetral-700 font-regular text-base">
                                                        left
                                                    </span>
                                                </p>
                                            </div>

                                            <p className="text-nuetral-700 mt-4 px-6">
                                                You get an ergonomic and elegant
                                                stand made of natural bamboo.
                                                You've helped us launch our
                                                promotional campaign, and you'll
                                                be added to a special Backer
                                                member list.
                                            </p>
                                            <p className="px-6 mt-4 text-nuetral-900 font-bold text-xl desktop:hidden">
                                                {bambooStock}{" "}
                                                <span className="text-nuetral-700 font-regular text-base">
                                                    left
                                                </span>
                                            </p>
                                        </label>

                                        <div
                                            className={`${
                                                pledge === 1
                                                    ? "border-t border-nuetral-700 border-opacity-20 desktop:flex"
                                                    : "hidden"
                                            } p-6 desktop:px-6 desktop:pt-6 desktop:py-0 text-center desktop:items-center desktop:justify-between`}
                                        >
                                            <p className="text-nuetral-700">
                                                Enter your pledge
                                            </p>
                                            {/* FIXME: MARKER */}
                                            <div className="flex items-center gap-4 mt-6 desktop:m-0">
                                                <div className="after:content-['$'] after:text-nuetral-700 after:font-bold after:block relative after:absolute after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:left-4">
                                                    <input
                                                        type="text"
                                                        placeholder="25"
                                                        className="focus-visible:outline-primary-400 w-full desktop:w-24 outline-none font-bold outline outline-1 outline-nuetral-700 rounded-full py-3 pl-7"
                                                        onChange={(e) =>
                                                            setPledgeAmount(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    className="bg-primary-400 text-nuetral-100 font-medium rounded-full px-6 desktop:px-10 py-4 hover:bg-primary-500"
                                                    onClick={() =>
                                                        setPledgeSubmitted(true)
                                                    }
                                                >
                                                    Continue
                                                </button>
                                            </div>
                                        </div>
                                    </li>

                                    <li
                                        className={`${
                                            blackEditionStock <= 0
                                                ? "opacity-40"
                                                : ""
                                        } grid gap-4 py-6 desktop:py-8 border border-nuetral-700 border-opacity-20 rounded-xl data-[selected='true']:border-2 data-[selected='true']:border-primary-400`}
                                        data-selected={`${
                                            pledge === 2 ? "true" : "false"
                                        }`}
                                        id="blackEdition"
                                    >
                                        <label
                                            htmlFor="option-3"
                                            className="cursor-pointer hover:text-primary-400"
                                        >
                                            <div className="flex justify-between px-6">
                                                <div className="flex gap-4 items-center">
                                                    <input
                                                        type="radio"
                                                        name="option"
                                                        id="option-3"
                                                        checked={pledge === 2}
                                                        onChange={() =>
                                                            setPledge(2)
                                                        }
                                                        className="scale-150 cursor-pointer"
                                                        disabled={
                                                            blackEditionStock <=
                                                            0
                                                        }
                                                    />
                                                    <div className="flex flex-col desktop:flex-row desktop:gap-4">
                                                        <h3 className="font-bold">
                                                            Black Edition Stand
                                                        </h3>
                                                        <p className="text-primary-400 font-medium">
                                                            Pledge $75 or more
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="hidden desktop:block text-nuetral-900 font-bold text-xl">
                                                    {blackEditionStock}{" "}
                                                    <span className="text-nuetral-700 font-regular text-base">
                                                        left
                                                    </span>
                                                </p>
                                            </div>

                                            <p className="text-nuetral-700 mt-4 px-6">
                                                You get a Black Special Edition
                                                computer stand and a personal
                                                thank you. You'll be added to
                                                our Backer member list. Shipping
                                                is included.
                                            </p>
                                        </label>
                                        <p className="px-6 mt-4 text-nuetral-900 font-bold text-xl desktop:hidden">
                                            {blackEditionStock}{" "}
                                            <span className="text-nuetral-700 font-regular text-base">
                                                left
                                            </span>
                                        </p>

                                        <div
                                            className={`${
                                                pledge === 2
                                                    ? "desktop:flex border-t border-nuetral-700 border-opacity-20"
                                                    : "hidden"
                                            } p-6 desktop:px-6 desktop:pt-6 desktop:py-0 text-center desktop:items-center desktop:justify-between`}
                                        >
                                            {/* FIXME: MARKER */}
                                            <p className="text-nuetral-700">
                                                Enter your pledge
                                            </p>
                                            <div className="flex items-center gap-4 mt-6 desktop:m-0">
                                                <div className="after:content-['$'] after:text-nuetral-700 after:font-bold after:block relative after:absolute after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:left-4">
                                                    <input
                                                        type="text"
                                                        placeholder="75"
                                                        className="focus-visible:outline-primary-400 w-full desktop:w-24 outline-none font-bold outline outline-1 outline-nuetral-700 rounded-full py-3 pl-7"
                                                        onChange={(e) =>
                                                            setPledgeAmount(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    className="bg-primary-400 text-nuetral-100 font-medium rounded-full px-6 desktop:px-10 py-4 hover:bg-primary-500"
                                                    onClick={() =>
                                                        setPledgeSubmitted(true)
                                                    }
                                                >
                                                    Continue
                                                </button>
                                            </div>
                                        </div>
                                    </li>

                                    <li
                                        className={`${
                                            mahoganyStock <= 0
                                                ? "opacity-40"
                                                : ""
                                        } grid gap-4 py-10 border border-nuetral-700 border-opacity-20 rounded-xl data-[selected='true']:border-2 data-[selected='true']:border-primary-400`}
                                        data-selected={`${
                                            pledge === 3 ? "true" : "false"
                                        }`}
                                        id="mahogany"
                                    >
                                        <label
                                            htmlFor="option-4"
                                            className="cursor-pointer hover:text-primary-400"
                                        >
                                            <div className="flex justify-between px-6">
                                                <div className="flex gap-4 items-center">
                                                    <input
                                                        type="radio"
                                                        name="option"
                                                        id="option-4"
                                                        checked={pledge === 3}
                                                        onChange={() =>
                                                            setPledge(3)
                                                        }
                                                        className="scale-150 cursor-pointer"
                                                        disabled={
                                                            mahoganyStock <= 0
                                                        }
                                                    />
                                                    <div className="flex flex-col desktop:flex-row desktop:gap-4">
                                                        <h3 className="font-bold">
                                                            Mahogany Special
                                                            Edition
                                                        </h3>
                                                        <p className="text-primary-400 font-medium">
                                                            Pledge $200 or more
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="hidden desktop:block text-nuetral-900 font-bold text-xl">
                                                    {mahoganyStock}{" "}
                                                    <span className="text-nuetral-700 font-regular text-base">
                                                        left
                                                    </span>
                                                </p>
                                            </div>

                                            <p className="text-nuetral-700 mt-4 px-6">
                                                You get two Special Edition
                                                Mahogany stands, a Backer
                                                T-Shirt, and a personal thank
                                                you. You'll be added to our
                                                Backer member list. Shipping is
                                                included.
                                            </p>
                                        </label>
                                        <p className="px-6 desktop:hidden mt-4 text-nuetral-900 font-bold text-xl">
                                            {mahoganyStock}{" "}
                                            <span className="text-nuetral-700 font-regular text-base">
                                                left
                                            </span>
                                        </p>

                                        <div
                                            className={`${
                                                pledge === 3
                                                    ? "desktop:flex border-t border-nuetral-700 border-opacity-20"
                                                    : "hidden"
                                            } p-6 desktop:px-6 desktop:pt-6 desktop:py-0 text-center desktop:items-center desktop:justify-between`}
                                        >
                                            <p className="text-nuetral-700">
                                                Enter your pledge
                                            </p>
                                            {/* FIXME:MARKER */}
                                            <div className="flex items-center gap-4 mt-6 desktop:m-0">
                                                <div className="after:content-['$'] after:text-nuetral-700 after:font-bold after:block relative after:absolute after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:left-4">
                                                    <input
                                                        type="text"
                                                        placeholder="200"
                                                        className="focus-visible:outline-primary-400 w-full desktop:w-24 outline-none font-bold outline outline-1 outline-nuetral-700 rounded-full py-3 pl-7"
                                                        onChange={(e) =>
                                                            setPledgeAmount(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    className="bg-primary-400 text-nuetral-100 font-medium rounded-full px-6 desktop:px-10 py-4 hover:bg-primary-500"
                                                    onClick={() =>
                                                        setPledgeSubmitted(true)
                                                    }
                                                >
                                                    Continue
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </form>
                        </>
                    ) : (
                        <>
                            <svg
                                className="mx-auto scale-125 desktop:scale-150 mt-10"
                                width="64"
                                height="64"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g fill="none" fillRule="evenodd">
                                    <circle
                                        fill="#3CB3AB"
                                        cx="32"
                                        cy="32"
                                        r="32"
                                    />
                                    <path
                                        stroke="#FFF"
                                        strokeWidth="5"
                                        d="M20 31.86L28.093 40 44 24"
                                    />
                                </g>
                            </svg>

                            <div className="text-center text-nuetral-700 grid gap-6 desktop:gap-10 mt-4 desktop:mt-8">
                                <p className="font-bold text-xl desktop:text-3xl text-nuetral-900">
                                    Thanks for your support!
                                </p>

                                <p className="desktop:text-xl">
                                    Your pledge brings us one step closer to
                                    sharing Mastercraft Bamboo Moniter Riser
                                    worldwide. You will get an email once our
                                    campaign is completed.
                                </p>

                                <button
                                    className="mb-8 bg-primary-400 text-nuetral-100 rounded-full justify-self-start px-8 desktop:px-10 py-3 desktop:py-4 mx-auto hover:bg-primary-500"
                                    onClick={(e) => handleOnSubmit(e)}
                                >
                                    Got it!
                                </button>
                            </div>
                        </>
                    )}
                </dialog>

                <div className="container px-8 desktop:px-48 mx-auto bg-nuetral-100">
                    <div className="relative -top-14 grid gap-8">
                        <div className="text-center py-8 desktop:py-16 px-4 desktop:px-16 bg-nuetral-100 border border-nuetral-700  border-opacity-30 rounded-xl">
                            <img
                                className="mx-auto absolute top-0 left-1/2 -translate-y-2/4 -translate-x-2/4"
                                src="/images/logo-mastercraft.svg"
                                alt=""
                            />
                            <div>
                                <h1 className="text-nuetral-900 font-bold text-xl desktop:text-3xl max-w-[20ch] desktop:max-w-[revert] mx-auto">
                                    Mastercraft Bamboo Monitor Riser
                                </h1>
                                <p className="mt-2 desktop:mt-4">
                                    A beautiful & handcrafted moniter stand to
                                    reduce neck and eye strain.
                                </p>

                                <div className="flex items-center justify-evenly desktop:justify-between mt-4 desktop:mt-10">
                                    <button
                                        className="bg-primary-400 text-nuetral-100 font-medium rounded-full px-8 desktop:px-12 py-4 hover:bg-primary-500"
                                        onClick={() =>
                                            handleSelectRewardClick(0)
                                        }
                                    >
                                        Back this project
                                    </button>
                                    <button
                                        className={`flex items-center bg-gray-200 rounded-full hover:opacity-70 ${
                                            bookmarked ? "text-primary-500" : ""
                                        }`}
                                        onClick={() =>
                                            setBookmarked((prev) => !prev)
                                        }
                                    >
                                        <svg
                                            width="56"
                                            height="56"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g fill="none" fillRule="evenodd">
                                                <circle
                                                    fill={`${
                                                        bookmarked
                                                            ? "hsl(176, 72%, 28%)"
                                                            : "#2F2F2F"
                                                    }`}
                                                    cx="28"
                                                    cy="28"
                                                    r="28"
                                                />
                                                <path
                                                    fill={`${
                                                        bookmarked
                                                            ? "hsl(0, 0%, 100%)"
                                                            : "#B1B1B1"
                                                    }`}
                                                    d="M23 19v18l5-5.058L33 37V19z"
                                                />
                                            </g>
                                        </svg>
                                        {matches && (
                                            <p className="pl-4 pr-6 font-medium">
                                                {bookmarked
                                                    ? "Bookmarked"
                                                    : "Bookmark"}
                                            </p>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="font-primary text-center p-8 desktop:p-14 bg-nuetral-100 border border-nuetral-700 border-opacity-30 rounded-xl">
                            {/* Responsive grid columns? */}
                            <div className="grid gap-8 desktop:grid-cols-3">
                                <div className="desktop:border-r border-nuetral-700">
                                    <h2 className="font-bold text-4xl">
                                        ${totalAmountRaised.toLocaleString()}
                                    </h2>
                                    <span className="text-nuetral-700 text-xs mt-2 block after:content-[''] after:w-16 after:mx-auto after:mt-4 after:h-[1px] after:bg-nuetral-700 after:block desktop:after:hidden">
                                        of ${max} backed
                                    </span>
                                </div>
                                <div className="desktop:border-r border-nuetral-700">
                                    <h2 className="font-bold text-4xl">
                                        {totalBackers}
                                    </h2>
                                    <span className="text-nuetral-700 text-xs mt-2 block after:content-[''] after:w-16 after:mx-auto after:mt-4 after:h-[1px] after:bg-nuetral-700 after:block desktop:after:hidden">
                                        total backers
                                    </span>
                                </div>
                                <div>
                                    <h2 className="font-bold text-4xl">
                                        {daysLeft}
                                    </h2>
                                    <span className="text-nuetral-700 text-xs">
                                        days left
                                    </span>
                                </div>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full">
                                <div
                                    // Tailwind doesn't support adding class names dynamically so w-[${percentage + "%"}] doesn't work, gonna have to use a good old fashion inline style tag
                                    className={`progress-bar | mt-8 h-[0.65rem] bg-primary-400 rounded-full`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="grid gap-8 p-8 bg-nuetral-100 border border-nuetral-700 border-opacity-30 rounded-xl">
                            <h2 className="font-bold text-lg">
                                About this project
                            </h2>
                            <p className="text-nuetral-700">
                                The Mastercraft Bamboo Monitor Riser is a sturdy
                                and stylish platform that elevates your screen
                                to a more comfortable viewing height. Placing
                                your monitor at eye level has the potential to
                                improve your posture and make you more
                                comfortable while at work, helping you stay
                                focused on the task at hand.
                            </p>
                            <p className="text-nuetral-700">
                                Featuring artisan craftsmanship, the simplicity
                                of design creates extra desk space below your
                                computer to allow notepads, pens, and USB sticks
                                to be stored under the stand.
                            </p>

                            <div
                                className={`${
                                    bambooStock <= 0 ? "opacity-40" : ""
                                } grid gap-4 p-6 border border-nuetral-700 border-opacity-20 rounded-xl`}
                            >
                                <div className="flex flex-col desktop:flex-row desktop:justify-between">
                                    <h3 className="font-bold">Bamboo Stand</h3>
                                    <p className="text-primary-400 font-medium">
                                        Pledge $25 or more
                                    </p>
                                </div>
                                <p className="text-nuetral-700">
                                    You get an ergonomic and elegant stand made
                                    of natural bamboo. You've helped us launch
                                    our promotional campaign, and you'll be
                                    added to a special Backer member list.
                                </p>
                                <div className="flex flex-col desktop:flex-row desktop:justify-between gap-8 items-start desktop:mt-6">
                                    <div className="flex gap-1 items-center">
                                        <p className="font-bold text-4xl">
                                            {bambooStock}
                                        </p>
                                        <p className="text-nuetral-700 text-lg">
                                            left
                                        </p>
                                    </div>
                                    <button
                                        className="bg-primary-400 text-nuetral-100 font-medium rounded-full px-8 desktop:px-10 py-4 hover:bg-primary-500"
                                        onClick={() =>
                                            handleSelectRewardClick(1)
                                        }
                                    >
                                        Select Reward
                                    </button>
                                </div>
                            </div>

                            <div
                                className={`${
                                    blackEditionStock <= 0 ? "opacity-40" : ""
                                } grid gap-4 p-6 border border-nuetral-700 border-opacity-30 rounded-xl`}
                            >
                                <div className="flex flex-col desktop:flex-row desktop:justify-between">
                                    <h3 className="font-bold">
                                        Black Edition Stand
                                    </h3>
                                    <p className="text-primary-400 font-medium">
                                        Pledge $75 or more
                                    </p>
                                </div>
                                <p className="text-nuetral-700">
                                    You get a Black Special Edition computer
                                    stand and a personal thank you. You'll be
                                    added to our Backer member list. Shipping is
                                    included.
                                </p>
                                <div className="flex flex-col desktop:flex-row desktop:justify-between gap-8 items-start desktop:mt-6">
                                    <div className="flex gap-1 items-center">
                                        <p className="font-bold text-4xl">
                                            {blackEditionStock}
                                        </p>
                                        <p className="text-nuetral-700 text-lg">
                                            left
                                        </p>
                                    </div>
                                    <button
                                        className="bg-primary-400 text-nuetral-100 font-medium rounded-full px-8 desktop:px-10 py-4 hover:bg-primary-500"
                                        onClick={() =>
                                            handleSelectRewardClick(2)
                                        }
                                    >
                                        Select Reward
                                    </button>
                                </div>
                            </div>

                            <div
                                className={`${
                                    mahoganyStock <= 0 ? "opacity-40" : ""
                                } grid gap-8 p-8 bg-nuetral-100 border border-nuetral-700 border-opacity-30 rounded-xl`}
                            >
                                <div className="flex flex-col desktop:flex-row desktop:justify-between">
                                    <h3 className="font-bold text-sm desktop:text-base">
                                        Mahogany Special Edition
                                    </h3>
                                    <p className="text-primary-400 font-medium">
                                        Pledge $200 or more
                                    </p>
                                </div>
                                <p className="text-nuetral-700">
                                    You get two Special Edition Mahogany stands,
                                    a Backer T-Shirt, and a personal thank you.
                                    You'll be added to our Backer member list.
                                    Shipping is included.
                                </p>
                                <div className="flex flex-col desktop:flex-row desktop:justify-between gap-8 items-start desktop:mt-6">
                                    <div className="flex gap-1 items-center">
                                        <p className="font-bold text-4xl">0</p>
                                        <p className="text-nuetral-700 text-lg">
                                            left
                                        </p>
                                    </div>
                                    <button
                                        className="bg-primary-400 text-nuetral-100 font-medium rounded-full px-8 desktop:px-10 py-4 hover:bg-primary-500"
                                        onClick={() =>
                                            handleSelectRewardClick(3)
                                        }
                                        disabled={mahoganyStock <= 0}
                                    >
                                        {mahoganyStock <= 0
                                            ? "Out of Stock"
                                            : "Select Reward"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default App;
