import React from 'react'
import { BiInfoCircle } from 'react-icons/bi'
import { CgArrowTopRight, CgArrowBottomLeft } from 'react-icons/cg'
import { Button } from './button'

type CardProps = {
        title: string
        value: string | number
        percent: number
        icon: React.ElementType
}

export const Card: React.FC<CardProps> = ({ title, value, percent, icon: Icon }) => {
        const isNegative = percent < 0
        const percentValue = Math.abs(percent)

        return (
                <div className='bg-background border border-secondary/20 p-4 rounded-lg space-y-8'>
                        <div className="flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                        <div className='bg-accent flex justify-center items-center p-2 rounded-md'>
                                                <Icon size={16} />
                                        </div>
                                        <span>{title}</span>
                                </div>
                                <Button size='w-[20px]'>
                                        <BiInfoCircle size={20} />
                                </Button>
                        </div>

                        <div className='flex items-start gap-4'>
                                <span className='text-3xl font-normal'>{value}</span>

                                <div
                                        className={`flex justify-center items-center gap-2 py-1 px-2 h-[25px] rounded-md ${isNegative ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
                                                }`}
                                >
                                        <span>{percentValue}%</span>
                                        {isNegative ? <CgArrowBottomLeft /> : <CgArrowTopRight />}
                                </div>
                        </div>
                </div>
        )
}
