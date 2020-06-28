const { MessageEmbed } = require('discord.js');


module.exports = 
{

    //* Start of CreateEmbed;
    CreateEmbed: 

    async function CreateEmbed(options)
    {
        let embed_type;
        let name;
        let content;
        let color;
        let thumbnail;
        let image;
        let author;
        let footer;
        


        const Embed = new MessageEmbed();

        for (item in options)
        {
            switch(item)
            {
                case "embed_type":
                    embed_type = options.embed_type;
                    break;

                case "name":
                    name = options.name;
                    break;

                case "content":
                    content = options.content;
                    break;

                case "color":
                    color = options.color;
                    break;

                case "thumbnail":
                    thumbnail = options.thumbnail;
                    break;

                case "image":
                    image = options.image;
                    break;

                case "author":
                    author = options.author;
                    break;

                case "footer":
                    footer = options.footer;
                    break;
            }
        }

        switch (embed_type)
        {
            case "Warn":
                Embed.setTitle("Warning");
                Embed.setColor("#FF4500");
                break;
    
            case "Info":
                Embed.setTitle("Information");
                Embed.setColor("#008080");
        }

        /**
        ** let embed_type;
        ** let name;
        ** let content;
        ** let color;
        ** let thumbnail;
        ** let image;
        ** let author;
        ** let footer;
         */

        if(name != undefined) Embed.setTitle(name);
        if(content != undefined) Embed.setDescription(content);
        if(color != undefined) Embed.setColor(color);
        if(thumbnail != undefined) Embed.setThumbnail(thumbnail);
        if(image != undefined) Embed.setImage(image);
        if(author != undefined) Embed.setAuthor(author);
        if(footer != undefined) Embed.setFooter(footer);

        Embed.setDescription(content);
    
        return Embed;
    },

    //* End of CreateEmbed;
}

