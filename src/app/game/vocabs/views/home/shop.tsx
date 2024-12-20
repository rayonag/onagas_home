import useRewardStore from "@/zustand/game/vocabs/rewards";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { LeadingActions, SwipeableList, SwipeableListItem, SwipeAction, TrailingActions, Type } from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import TrashIcon from "../../components/icons/TrashIcon";
import SendMessage from "./test";
import useGoldStore from "@/zustand/game/vocabs/gold";
import ArrowLeft from "./ArrowLeft";
import usePageStore from "@/zustand/page";
import useShopStore from "@/zustand/game/vocabs/shop";

const Shop = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReward, setSelectedReward] = useState<number | null>(null);
    const { rewards, getRewards, deleteReward, addReward } = useRewardStore(
        useShallow((state) => ({
            rewards: state.rewards,
            getRewards: state.getRewards,
            deleteReward: state.deleteReward,
            addReward: state.addReward,
        }))
    );
    const { shop, getShop, increasePrice } = useShopStore(
        useShallow((state) => ({
            shop: state.shop.sort((a, b) => a.id - b.id),
            getShop: state.getShop,
            increasePrice: state.increasePrice,
        }))
    );
    const setPage = usePageStore((state) => state.setPage);
    const gold = useGoldStore((state) => state.gold);
    const minusGold = useGoldStore((state) => state.minusGold);
    const getGold = useGoldStore((state) => state.getGold);

    useEffect(() => {
        getRewards();
    }, [getRewards]);
    useEffect(() => {
        getShop();
    }, [getShop]);
    useEffect(() => {
        getGold();
    }, [getGold]);

    const handleSubmit = async () => {
        if (selectedReward === null) return;
        if (!shop) return alert("Something went wrong");
        const selectedItem = shop.find((item) => item.id == selectedReward);
        if (!selectedItem) return alert("Something went wrong");
        if (!gold || parseInt(gold) < selectedItem?.price) return alert("ゴールドが足りないよ");

        const payload = {
            prise: selectedItem.item,
        };

        try {
            const res = await fetch("/api/LINE", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            console.log("Response from API:", data);
            if (data.message) {
                const res2 = minusGold(selectedItem.price);
            }
            increasePrice(selectedItem.price, selectedItem.id);
            updateAll();
            alert("旦那に申請したよ！");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    const updateAll = () => {
        getRewards();
        getGold();
    };

    return (
        <div>
            <div style={{ backgroundPosition: "center", backgroundSize: "cover", backgroundImage: `url('/vocabs/bg/bg-shop.png')` }} className="overflow-hidden flex flex-col h-screen justify-center text-center items-center text-white">
                <div onClick={() => setPage("rewards")} className="absolute top-10 left-0 flex items-center justify-center ml-5 bg-orange-600 bg-opacity-50 rounded-full text-white h-12 w-12">
                    <span className="">
                        <ArrowLeft />
                    </span>
                </div>
                <div className="flex justify-center items-center m-2 bg-theme6 rounded-lg text-white h-1/8 w-48">
                    <span className="text-2xl z-10">TOTAL: {gold} Gold</span>
                </div>
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Item</th>
                            <th className="px-4 py-2">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shop.map((item) => (
                            <tr key={item.id} className={`${selectedReward == item.id ? "bg-theme3" : ""}`} onClick={() => setSelectedReward(item.id)}>
                                <td className="border px-4 py-2">{item.item}</td>
                                <td className="border px-4 py-2">{item.price} Gold</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="flex justify-center items-center font-bold m-2 bg-theme2 !bg-opacity-90 rounded-full mt-8 text-white h-12 w-48" onClick={() => handleSubmit()}>
                    <span className="text-xl z-10">旦那に申請する</span>
                </button>
            </div>
        </div>
    );
};

export default Shop;
