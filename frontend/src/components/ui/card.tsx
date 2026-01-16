import React from 'react'
import { BiInfoCircle } from 'react-icons/bi'
import { CgArrowTopRight, CgArrowBottomLeft } from 'react-icons/cg'
import { Button } from './button'
import { CardProps } from '@/types/shared/ui'

export const Card: React.FC<CardProps> = ({ title, value, percent, icon: Icon }) => {
        const isNegative = percent !== undefined && percent < 0;
        const percentValue = percent !== undefined ? Math.abs(percent) : 0;

        return (
                <div className="bg-background border border-secondary/20 p-5 rounded-2xl space-y-6">
                        <div className="flex justify-between items-center">
                                <div className="flex gap-3 items-center">
                                        <div className="bg-accent flex justify-center items-center p-2 rounded-md">
                                                <Icon size={16} />
                                        </div>
                                        <span className="font-medium text-sm text-secondary">{title}</span>
                                </div>
                                <Button size="icon" route="/auth/signin" className="h-6 w-6 p-0">
                                        <BiInfoCircle size={18} />
                                </Button>
                        </div>

                        <div className="flex items-end justify-between">
                                <span className="text-4xl leading-none">{value}</span>

                                {percent !== undefined && (
                                        <div className="flex flex-col items-end gap-1">
                                                <div
                                                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-medium ${isNegative ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
                                                                }`}
                                                >
                                                        <span>{percentValue}%</span>
                                                        {isNegative ? <CgArrowBottomLeft /> : <CgArrowTopRight />}
                                                </div>
                                                <span className="text-xs text-secondary/80">Dari bulan lalu</span>
                                        </div>
                                )}
                        </div>
                </div>
        );
};