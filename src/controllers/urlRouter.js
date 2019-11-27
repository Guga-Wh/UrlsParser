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
            answerWiki = filter(wiki, wiki)

            while( x > 1){
                let wikiChildrens = []
            for(const a of wiki){
                if(a) {

                const found = await Link.findOne({ host:a})
                if(!found){

                 wikiChildrens =   MyUrlParser(http + a)
                }  else {
                 Link.find({ host:a}, function(err, docs) {
                    docs.forEach(x => {
                        wikiChildrens.push(x.link)
                    })
                    })
                }

                wikiChildren.push(wikiChildrens)


                const diff = filter(wikiChildren, answerWiki)

                for(const b of diff)
                if(b.length !== 0)
                  answerWiki.push(b)
                }

            }
                x--
                wiki = wikiChildren
            }
            
        let arrAnswer = []
        arrAnswer[index] = answerWiki
        answerWiki = []
        }


            res.send(arrAnswer)
        } catch(e) {
            res.status(400).send()
        }
        
    }
 }
 const filter = function(arr1,arr2) { return arr1.filter(x => !arr2.includes(x)); }

 const MyUrlParser = async (url) => {
    const wikiUrls = [];

    const myUrl = urls.parse(url)
    await rp(url)
     .then(function(html){
     let c = ''
     const length = $('a', html).length
     console.log(length)
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
 