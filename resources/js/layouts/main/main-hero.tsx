import { Crown } from 'lucide-react';
import TextAnimator from '@/registry/new-york/components/ui/animations/text-animator';
import { ButtonParticles } from '@/registry/new-york/components/ui/buttons/button-particles';
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
                className={`bg-mute/20 relative isolate flex min-h-120 w-full items-center justify-center overflow-clip rounded-[inherit] border border-border`}
            >
                <div className={`flex flex-col space-y-3 p-6`}>
                    <div className="relative mx-auto inline-flex translate-y-6 justify-center rounded-full border border-border px-6 py-1">
                        <TextAnimator
                            effectColor={[
                                'oklch(58.5% 0.233 277.117)',
                                'oklch(58.5% 0.233 277.117)',
                            ]}
                            animation={`zap`}
                            splitBy={`chars`}
                            yoyo={true}
                            repeat={-1}
                            className={`font-mono text-sm tracking-wide text-balance`}
                        >
                            copy it, paste it, ship it
                        </TextAnimator>
                        <GlowRadial
                            size={150}
                            borderWidth={2}
                            colors={[
                                'var(--color-cyan-500)',
                                'var(--color-indigo-500)',
                            ]}
                        />
                        <GlowRadial
                            size={150}
                            borderWidth={4}
                            className={`blur`}
                            colors={[
                                'var(--color-cyan-500)',
                                'var(--color-indigo-500)',
                            ]}
                        />
                    </div>
                    <h1 className="text-center text-5xl font-bold tracking-tighter text-balance md:text-7xl">
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
                        className={`mx-auto max-w-3xl text-center tracking-wide text-balance md:text-lg`}
                    >
                        We are a team of passionate designers and developers
                        dedicated to creating beautiful and functional user
                        interfaces.
                    </p>

                    <div className="group flex justify-center space-x-4">
                        <ButtonParticles
                            colors={['var(--primary)', 'var(--color-muted)']}
                        >
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
                        </ButtonParticles>
                        <ButtonParticles
                            colors={['var(--primary)', 'var(--color-muted)']}
                            className={`relative`}
                            variant="secondary"
                        >
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
                        </ButtonParticles>
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
