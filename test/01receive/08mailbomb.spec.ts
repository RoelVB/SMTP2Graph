import { expect } from 'chai';
import '../_config';
import { Server } from '../classes/Server';
import { defaultMail, defaultTransportOptions, ISubmitMail, verifyMail } from './Helpers';
import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { MailQueue } from '../classes/MailQueue';

describe('Receive: Mailbomb', async function(){
    const server = new Server({
        mode: 'receive',
    });

    before('Start server', async function(){
        await expect(server.start(), 'Failed to start SMTP server').to.eventually.be.fulfilled;
    });

    after('Stop server', async function(){
        await server.stop();
    });

    it('Mailbomb', async function(){
        // Create a transport that will be reused/pooled
        const transport = createTransport({...defaultTransportOptions, pool: true});
        const mails: {sent: SMTPTransport.SentMessageInfo, mail: ISubmitMail['mail']}[] = []; 

        // Send messages
        for(let i=0; i<5; i++)
        {
            const mail: ISubmitMail['mail'] = {...defaultMail, subject: `TEST: ${this.test?.title} ${i+1}`};
            const sent: SMTPTransport.SentMessageInfo = await expect(transport.sendMail(mail), 'Failed to submit message').to.eventually.be.fulfilled;
            mails.push({mail, sent});
        }

        // Verify sent messages
        for(const mail of mails)
        {
            const mailFile: Awaited<ReturnType<typeof MailQueue.findFileByMessageId>> = await expect(MailQueue.findFileByMessageId(mail.sent.messageId)).to.eventually.be.fulfilled;
            expect(mailFile, `Could not find queued EML for message-id: ${mail.sent.messageId}`).to.not.be.undefined;
            if(mailFile)
            {
                MailQueue.deleteFile(mailFile.file);
                await verifyMail(mail.mail || {}, mail.sent, mailFile.mail);
            }
        }
    });

});
