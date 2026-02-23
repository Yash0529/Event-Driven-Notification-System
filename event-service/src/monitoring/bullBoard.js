import {createBullBoard} from '@bull-board/api';
import {BullMQAdapter} from '@bull-board/api/bullMQAdapter';
import {ExpressAdapter} from '@bull-board/express';
import eventQueue from '../queue/event.queue.js';
import deadLetterQueue from '../queue/dead.letter.queue.js';

const serverAdapter=new ExpressAdapter();

serverAdapter.setBasePath("/admin/queues");

createBullBoard({
    queues:[
        new BullMQAdapter(eventQueue),
        new BullMQAdapter(deadLetterQueue),
    ],
    serverAdapter,
});

export default serverAdapter;