import { Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TextAnimator from '@/registry/new-york/components/ui/animations/text-animator';
import { GlowRadial } from '@/registry/new-york/components/ui/glow/glow-radial';
import WavesThree from '@/registry/new-york/components/ui/threejs/waves-three';

export default function MainHero() {
    const colors = `var(--primary)`;

    return (
        <div className={`relative mt-4 rounded-2xl`}>
            <GlowRadial colors={colors} className={`absolute inset-0`} />
            <GlowRadial
                colors={colors}
                borderWidth={15}
                className={`absolute -inset-2 opacity-25 blur-xs`}
            />
            <div
                className={`bg-mute/20 relative isolate grid min-h-100 w-full place-content-center overflow-clip rounded-[inherit] border border-border`}
            >
                <div className={`space-y-3 p-6`}>
                    <h1 className="text-center text-5xl font-black tracking-tighter text-balance md:text-7xl">
                        <span>Components</span>
                        <span
                            className={`inline-block translate-y-4 font-playfair-display text-9xl font-medium italic opacity-50`}
                        >
                            &
                        </span>
                        <TextAnimator
                            text="Animations"
                            animation={`zap`}
                            repeat={-1}
                        />
                    </h1>

                    <p
                        className={`mx-auto max-w-xl text-center tracking-wide text-balance md:text-lg`}
                    >
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Accusamus dignissimos exercitationem, nulla
                        pariatur sed vel!
                    </p>
                    <div className="group flex justify-center space-x-4">
                        <Button className={`relative`}>
                            <GlowRadial
                                size={150}
                                colors={[`var(--primary), transparent`]}
                                borderWidth={3}
                                className={`absolute -inset-1 blur-xs`}
                            />
                            <GlowRadial
                                size={150}
                                colors={[`var(--primary), transparent`]}
                                borderWidth={2}
                                className={`absolute -inset-0.5`}
                            />
                            <GlowRadial
                                size={150}
                                colors={[`var(--primary), transparent`]}
                                borderWidth={2}
                                className={`absolute -inset-1.5 mix-blend-color-dodge blur-xs`}
                            />
                            <Crown className="group-hover:text-brand size-4" />
                            <span>Premium Components</span>
                        </Button>
                        <Button className={`relative`} variant="secondary">
                            <GlowRadial
                                colors={colors}
                                size={150}
                                borderWidth={3}
                                className={`absolute -inset-1 blur-xs`}
                            />
                            <GlowRadial
                                colors={colors}
                                size={150}
                                borderWidth={2}
                                className={`absolute -inset-0.5`}
                            />
                            <GlowRadial
                                colors={colors}
                                size={150}
                                borderWidth={2}
                                className={`absolute -inset-1.5 mix-blend-color-dodge blur-xs`}
                            />
                            View Components
                        </Button>
                    </div>
                </div>

                <WavesThree
                    cameraPosition={{ x: 0, y: -20, z: 5 }}
                    style="wireframe"
                    colors={['#a1a1a1', '#646464']}
                    className={`mask-linear -inset-10 -z-20 rounded-[inherit] mask-linear-from-10% mask-linear-to-50% opacity-20`}
                />
            </div>
        </div>
    );
}
