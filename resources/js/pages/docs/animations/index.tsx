import DocsLayout from '@/layouts/docs/layout';
import MainLayout from '@/layouts/main-layout';
import { index as docs } from '@/routes/docs';
import { index as animationsIndex } from '@/routes/docs/animations';

export default function AnimationsIndex() {
    return (
        <DocsLayout
            breadcrumbs={[
                {
                    title: 'Docs',
                    href: docs.url(),
                },

                {
                    title: 'Animations',
                    href: animationsIndex.url(),
                },
            ]}
        >
            <div className="space-y-8">
                <h1 className={`text-2xl font-bold`}>Animations</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Architecto earum impedit inventore libero obcaecati quas,
                    repellendus ullam ut veniam voluptatum. Dolor et explicabo
                    maxime odio praesentium quam qui, quia velit.
                </p>
                <p>
                    Cupiditate nesciunt nulla omnis quidem voluptatem! Animi
                    expedita explicabo facere id officiis provident ratione,
                    voluptates? Accusantium natus quae sed vero? Atque
                    doloremque ipsum nam nulla quidem repudiandae sit temporibus
                    voluptas.
                </p>
                <p>
                    Accusamus aut beatae culpa dolorem dolorum iste, modi porro
                    qui, quibusdam quod sequi sunt temporibus vitae voluptatem
                    voluptates! Amet itaque minus ratione temporibus totam.
                    Impedit officia perspiciatis quos vel vero.
                </p>
                <p>
                    Ab accusamus aliquid aspernatur at deleniti distinctio
                    eligendi eos esse est incidunt magnam magni minus nostrum
                    nulla officia omnis placeat quam quidem sit sunt temporibus,
                    ullam voluptates voluptatibus? Alias, dolorem.
                </p>{' '}
                <p>
                    Cupiditate nesciunt nulla omnis quidem voluptatem! Animi
                    expedita explicabo facere id officiis provident ratione,
                    voluptates? Accusantium natus quae sed vero? Atque
                    doloremque ipsum nam nulla quidem repudiandae sit temporibus
                    voluptas.
                </p>
                <p>
                    Accusamus aut beatae culpa dolorem dolorum iste, modi porro
                    qui, quibusdam quod sequi sunt temporibus vitae voluptatem
                    voluptates! Amet itaque minus ratione temporibus totam.
                    Impedit officia perspiciatis quos vel vero.
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Architecto earum impedit inventore libero obcaecati quas,
                    repellendus ullam ut veniam voluptatum. Dolor et explicabo
                    maxime odio praesentium quam qui, quia velit.
                </p>
                <p>
                    Cupiditate nesciunt nulla omnis quidem voluptatem! Animi
                    expedita explicabo facere id officiis provident ratione,
                    voluptates? Accusantium natus quae sed vero? Atque
                    doloremque ipsum nam nulla quidem repudiandae sit temporibus
                    voluptas.
                </p>
                <p>
                    Accusamus aut beatae culpa dolorem dolorum iste, modi porro
                    qui, quibusdam quod sequi sunt temporibus vitae voluptatem
                    voluptates! Amet itaque minus ratione temporibus totam.
                    Impedit officia perspiciatis quos vel vero.
                </p>
                <p>
                    Ab accusamus aliquid aspernatur at deleniti distinctio
                    eligendi eos esse est incidunt magnam magni minus nostrum
                    nulla officia omnis placeat quam quidem sit sunt temporibus,
                    ullam voluptates voluptatibus? Alias, dolorem.
                </p>{' '}
                <p>
                    Cupiditate nesciunt nulla omnis quidem voluptatem! Animi
                    expedita explicabo facere id officiis provident ratione,
                    voluptates? Accusantium natus quae sed vero? Atque
                    doloremque ipsum nam nulla quidem repudiandae sit temporibus
                    voluptas.
                </p>
                <p>
                    Accusamus aut beatae culpa dolorem dolorum iste, modi porro
                    qui, quibusdam quod sequi sunt temporibus vitae voluptatem
                    voluptates! Amet itaque minus ratione temporibus totam.
                    Impedit officia perspiciatis quos vel vero.
                </p>
                <p>
                    Ab accusamus aliquid aspernatur at deleniti distinctio
                    eligendi eos esse est incidunt magnam magni minus nostrum
                    nulla officia omnis placeat quam quidem sit sunt temporibus,
                    ullam voluptates voluptatibus? Alias, dolorem.
                </p>{' '}
                <p>
                    Cupiditate nesciunt nulla omnis quidem voluptatem! Animi
                    expedita explicabo facere id officiis provident ratione,
                    voluptates? Accusantium natus quae sed vero? Atque
                    doloremque ipsum nam nulla quidem repudiandae sit temporibus
                    voluptas.
                </p>
                <p>
                    Accusamus aut beatae culpa dolorem dolorum iste, modi porro
                    qui, quibusdam quod sequi sunt temporibus vitae voluptatem
                    voluptates! Amet itaque minus ratione temporibus totam.
                    Impedit officia perspiciatis quos vel vero.
                </p>
                <p>
                    Ab accusamus aliquid aspernatur at deleniti distinctio
                    eligendi eos esse est incidunt magnam magni minus nostrum
                    nulla officia omnis placeat quam quidem sit sunt temporibus,
                    ullam voluptates voluptatibus? Alias, dolorem.
                </p>
                <p>
                    Consequatur dicta eligendi exercitationem modi neque numquam
                    quia quidem sapiente veniam? Atque eveniet explicabo illo
                    incidunt neque quia repellendus reprehenderit sapiente vero!
                    Commodi ipsum minus neque suscipit! Et, obcaecati sequi.
                </p>
            </div>
        </DocsLayout>
    );
}

AnimationsIndex.displayName = 'AnimationsIndex';

AnimationsIndex.layout = MainLayout;
