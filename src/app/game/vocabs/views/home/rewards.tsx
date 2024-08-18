import useRewardStore from "@/zustand/game/vocabs/rewards";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { LeadingActions, SwipeableList, SwipeableListItem, SwipeAction, TrailingActions, Type } from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import TrashIcon from "../../components/icons/TrashIcon";
interface Reward {
    id: number;
    reward: string;
}

interface Props {
    rewards: Reward[];
}
const Rewards = () => {
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
    useEffect(() => {
        getRewards();
    }, [getRewards]);
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReward(null);
        setTreasureReveal(false);
        setTreasureOpen(false);
    };
    const trailingActions = (id: number) => (
        <TrailingActions>
            <SwipeAction
                destructive={true}
                onClick={() => {
                    deleteReward(id);
                }}
            >
                <div className="flex flex-col justify-center items-center bg-theme2 w-20 h-full text-white ">
                    <TrashIcon color="red" size={36} />
                    <span className="text-2xl z-10 mb-6">Delete</span>
                </div>
            </SwipeAction>
        </TrailingActions>
    );
    const leadingActions = (id: number) => (
        <LeadingActions>
            <SwipeAction destructive={true} onClick={() => openReward(id)}>
                <div className="flex flex-col justify-center items-center bg-theme3 w-20 h-full text-white ">
                    <Image className="mt-3" src={`/vocabs/treasure/treasure_open.png`} alt={"Open"} width={100} height={100} />
                    <span className="text-2xl z-10">Open</span>
                </div>
            </SwipeAction>
        </LeadingActions>
    );
    const openReward = (id: number) => {
        console.log("open reward", id);
        setSelectedReward(id);
        setIsModalOpen(true);
        console.log("treasureOpen", treasureOpen);
        setTimeout(() => {
            setTreasureOpen(true);
            setTimeout(() => {
                setTreasureReveal(true);
            }, 1500);
        }, 2000);
    };
    const [treasureOpen, setTreasureOpen] = useState(false);
    const [treasureReveal, setTreasureReveal] = useState(false);
    return (
        <>
            <div className="flex justify-center items-center m-2 bg-theme2 rounded-lg text-white h-1/8 w-2/5">
                <span className="text-2xl z-10">Rewards</span>
            </div>
            <div className="flex flex-col justify-center items-center m-2 bg-theme2 rounded-lg text-white max-h-fit">
                {rewards && (
                    <SwipeableList threshold={0.4} fullSwipe={true} type={Type.IOS}>
                        {rewards.map((r, index) => (
                            <SwipeableListItem className="" key={r.id} leadingActions={leadingActions(r.id)} trailingActions={trailingActions(r.id)}>
                                <div key={index} className="border-b-2 border-double flex flex-col justify-center items-center bg-theme6 text-white h-1/4 w-full">
                                    <div className="text-2xl z-10">{r.reward}</div>
                                    <div className="">
                                        <Image src={`/vocabs/treasure/treasure_yellow.png`} alt={r.reward} width={100} height={100} />
                                    </div>
                                </div>
                            </SwipeableListItem>
                        ))}
                    </SwipeableList>
                )}
                {/* <div className="btn-theme" onClick={() => addReward("Ramen!")}>
                    Add Reward
                </div> */}
            </div>
            {isModalOpen && selectedReward && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
                    {treasureReveal || (
                        <div className="relative bg-white p-4 rounded-lg" onClick={(e) => e.stopPropagation()}>
                            <div className="animate-treasure">{treasureOpen ? <Image src={`/vocabs/treasure/treasure_opened.png`} alt={"Opened"} width={100} height={100} /> : <Image src={`/vocabs/treasure/treasure_yellow.png`} alt={rewards.find((r) => r.id == selectedReward)?.reward || ""} width={100} height={100} />}</div>
                        </div>
                    )}
                    {treasureReveal && (
                        <div className="relative bg-white p-4 rounded-lg" onClick={(e) => e.stopPropagation()}>
                            <div className="text-center flex animate-bounce">
                                <span className="text-2xl">{rewards.find((r) => r.id == selectedReward)?.reward}</span>
                                <div className="light-beam"></div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Rewards;