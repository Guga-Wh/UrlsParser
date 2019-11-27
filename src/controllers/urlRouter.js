var parse = require('url-parse')
const rp = require('request-promise');
const $ = require('cheerio');
var validator = require('validator');
const Link = require('../models/link')
const urls = require('url');

module.exports = {
    urlParse: async (req, res) => {
        try{ 
            let x = req.body.x
            let urlss = req.body.urls
            for(index in urlss){
            const url = urlss[index]
            let wiki = await MyUrlParser(url)
            const http = 'https://'
            let answerWiki = []
            let wikiChildren = []
            Array.prototype.diff = function(arr2) { return this.filter(x => arr2.includes(x)); }
            answerWiki = wiki.diff(wiki)

            while( x > 1){
                let wikiChildrens = []
            for(a in wiki){
                if(wiki[a]) {

                const found = await Link.findOne({ host:wiki[a]})
                if(!found){

                 wikiChildrens =  await MyUrlParser(http + wiki[a])
                }  else {
                await Link.find({ host:wiki[a]}, function(err, docs) {
                    docs.forEach(x => {
                        wikiChildrens.push(x.link)
                    })
                    })
                }

                wikiChildren.push(wikiChildrens)


                Array.prototype.diff = function(arr2) { return this.filter(x => !arr2.includes(x)); }
                const diff = wikiChildren.diff(answerWiki)

                for(b in diff)
                if(diff[b].length !== 0)
                  answerWiki.push(diff[b])
                }

            }
                x--
                wiki = wikiChildren
            }
            
        }


            res.send(answerWiki)
        } catch(e) {
            res.status(400).send()
        }
        
    }
 }

 const MyUrlParser = async (url) => {
    const wikiUrls = [];

    const myUrl = urls.parse(url)
    await rp(url)
     .then(function(html){
     let c = ''
     const length = $('a', html).length
     for (let i = 0; i < length; i++) {
         c = $('a', html)[i].attribs.href
         if(c) {
         c = (myUrl.hostname + c)
         if(c.includes(myUrl.hostname))
         wikiUrls.push(c);
         const links = new Link ({
             link: myUrl.hostname + c,
             host: url,
             parsed: true
         })
         links.save()
     }
         else continue
     }

     })
         .catch(function(err){
     });
     return wikiUrls
 }
 