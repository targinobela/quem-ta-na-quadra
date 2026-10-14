export interface Athlete {
  id: string; name: string; fullName: string; aliases: string[]; photo: string;
  crop: [number, number, number]; author: string; file: string; license: string; licenseUrl: string;
  verified: string; identitySource: string; changes: string;
}
export const CATALOG_VERSION = '2026-10-14.1';
const entries: [string,string,string,string[],string,string,string,string,[number,number,number]][] = [
 ['gabi','Gabi Guimarães','Gabriela Braga Guimarães',['Gabi','Gabriela Guimarães'],'Gabi, Grand Prix Łódź, Poland.jpg','Zorro2212','CC BY-SA 3.0','by-sa/3.0',[0.575,0.28,0.45]],
 ['ngapeth',"Earvin N’Gapeth","Earvin N’Gapeth",['Ngapeth',"Earvin N'Gapeth"],"Earvin N'Gapeth.JPG",'Maria Giulia Tolotti','CC BY-SA 3.0','by-sa/3.0',[0.46,0.29,0.68]],
 ['giba','Giba','Gilberto Amauri de Godoy Filho',['Gilberto Godoy Filho'],'Giba.JPG','shaka (recorte: Capmo)','CC BY-SA 2.0 Itália','by-sa/2.0/it',[0.54,0.13,0.44]],
 ['zhu','Zhu Ting','Zhu Ting',['Ting Zhu'],'Zhu Ting 2016 (cropped).jpg','Sakhalinio (recorte: Zafer)','CC BY-SA 4.0','by-sa/4.0',[0.5,0.25,0.72]],
 ['sheilla','Sheilla Castro','Sheilla Tavares de Castro',['Sheilla','Sheila Castro'],'Sheilla Castro no Minas 2002.jpg','Krapto','CC BY 4.0','by/4.0',[0.55,0.22,0.56]],
 ['bruno','Bruno Rezende','Bruno Mossa de Rezende',['Bruninho'],'Bruno Rezende2.jpg','Bigsofo','CC BY-SA 3.0','by-sa/3.0',[0.5,0.48,0.96]],
 ['kim','Kim Yeon-koung','Kim Yeon-koung',['Kim Yeon-kyung','Yeon Koung Kim'],'월드그랑프리2 (8).jpg','매맞는고참 / NOH DEOK KEUN','CC BY 4.0','by/4.0',[0.5,0.37,0.4]],
 ['serginho','Serginho','Sérgio Dutra Santos',['Escadinha','Sérgio Santos','Sergio Santos'],'Sérgio Santos Rio 2016cr.jpg','Fernando Frazão/Agência Brasil (recorte: Materialscientist)','CC BY 3.0 Brasil','by/3.0/br',[0.54,0.29,0.55]],
 ['jaqueline','Jaqueline Carvalho','Jaqueline Maria Pereira de Carvalho',['Jaque','Jaqueline'],'Jaqueline Cropped.jpg','Roosewelt Pinheiro/Agência Brasil (recorte: Mwaldeck)','CC BY 3.0 Brasil','by/3.0/br',[0.5,0.35,1]],
 ['thaisa','Thaísa Menezes','Thaísa Daher de Menezes',['Thaísa','Thaisa'],'Thaisa Cropped.jpg','Roosewelt Pinheiro/Agência Brasil','CC BY 3.0 Brasil','by/3.0/br',[0.5,0.39,1]],
 ['garay','Fernanda Garay','Fernanda Garay Rodrigues',['Fê Garay','Fe Garay'],'Fê garay.png','Murilodias','CC BY-SA 3.0','by-sa/3.0',[0.56,0.28,0.62]],
 ['lang','Lang Ping','Lang Ping',['Jenny Lang Ping'],'Lang Ping - 2021.jpg','Fjn219','CC BY-SA 4.0','by-sa/4.0',[0.5,0.39,0.92]],
 ['kurek','Bartosz Kurek','Bartosz Kurek',['Kurek'],'Bartosz Kurek 2012.jpg','Anna Kłeczek (Nula)','CC BY-SA 3.0','by-sa/3.0',[0.51,0.39,0.95]],
 ['ivan','Ivan Zaytsev','Ivan Zaytsev',['Zaytsev'],'Ivan Zaytsev.jpg','Maria Giulia Tolotti','CC BY-SA 3.0','by-sa/3.0',[0.43,0.33,0.65]],
 ['saori','Saori Kimura','Saori Kimura',['Kimura Saori'],'Saori Kimura.jpg','m-louis','CC BY-SA 2.0','by-sa/2.0',[0.46,0.265,0.34]],
];
export const catalog: Athlete[] = entries.map(([id,name,fullName,aliases,file,author,license,path,crop]) => ({
 id,name,fullName,aliases,file,author,license,crop,photo:`photos/${id==='kim'?'kim-2014':id==='kurek'?'kurek-2012':id}.${file.endsWith('.png')?'png':'jpg'}`,
 licenseUrl:`https://creativecommons.org/licenses/${path}/`,verified:'2026-10-14',
 identitySource:`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(' ','_'))}`,
 changes:'Recorte quadrado em canvas e pixelização progressiva; original local preservado. As adaptações da imagem mantêm a licença indicada.',
}));
