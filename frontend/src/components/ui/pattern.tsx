import { PatternLogoProps } from "@/types/shared/ui";

export const PatternLogo: React.FC<PatternLogoProps> = ({ className, style }) => {

        return (
                <div
                        className={`absolute w-[200px] h-[200px] bg-[#3F3FF3] ${className}`}
                        style={{
                                maskImage: "url('/images/logo/stt-wastukancana.png')",
                                WebkitMaskImage: "url('/images/logo/stt-wastukancana.png')",
                                maskSize: "contain",
                                WebkitMaskSize: "contain",
                                maskRepeat: "no-repeat",
                                WebkitMaskRepeat: "no-repeat",
                                maskPosition: "center",
                                WebkitMaskPosition: "center",
                                ...style
                        }}
                />
        );
};