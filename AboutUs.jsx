import React from 'react';

const AboutUs = () => {
  return (
    <section className="bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          About Us
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-12">
         Mirësevini në Kinemane, destinacioni juaj i preferuar për eksperienca të paharrueshme kinematografike. Që nga hapja jonë, jemi përkushtuar t’ju ofrojmë magjinë e ekranit të madh, me një gamë të gjerë filmash—from blockbuster-at më të fundit deri te klasikët e përjetshëm.

Ne, përqendrohemi tek komoditeti, cilësia dhe kënaqësia e klientëve. Ekranet tona moderne, sistemi i zërit i jashtëzakonshëm dhe sediljet komode sigurojnë që çdo vizitë të jetë e paharrueshme. Qoftë për një shëtitje familjare, një mbrëmje romantike, apo për një aventurë të vetmuar kinematografike, ne krijojmë një ambient ku historitë bëhen reale.

Misioni ynë është i thjeshtë: të lidhim njerëzit përmes dashurisë për filmin. Besojmë se filmat nuk janë thjesht argëtim—ata frymëzojnë, zbavisin dhe bashkojnë njerëzit.

Bashkohuni me ne për natën tuaj të ardhshme të filmave dhe përjetoni kinemanë si kurrë më parë!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800  p-6 hover:scale-105 transform transition">
            <img src="/public/ekipi.jpg" 
              
              alt="Ekipi ynë" 
              className="w-50 h-50 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Ekipi ynë</h3>
            <p className="text-gray-400 text-sm">
              Ekipi ynë i dedikuar punon për t’ju ofruar një eksperiencë kinematografike të shkëlqyer.Ekipi ynë është zemra e çdo përvoje kinematografike. Çdo anëtar sjell pasion dhe profesionalizëm në punën e tij, duke garantuar që çdo vizitor të ndjejë magjinë e filmit që nga momenti që hyn në sallë. Nga stafi i teknologjisë së zërit, operatorët e projektorëve, deri tek mikpritësit dhe menaxherët – të gjithë punojnë bashkë për të krijuar një ambient mikpritës dhe komod. Ne besojmë se suksesin e një vizite e bën jo vetëm filmi, por edhe njerëzit që e bëjnë të mundur këtë eksperiencë.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 hover:scale-105 transform transition">
            <img src="/public/misioni.jpg" 

              alt="Misioni ynë" 
              className="w-50 h-50 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Misioni ynë</h3>
            <p className="text-gray-400 text-sm">
              Të ofrojmë një ambient të rehatshëm dhe të sigurt për të shijuar filmat e preferuar me familjen dhe miqtë.Misioni ynë është i thjeshtë: të ofrojmë një përvojë kinematografike të paharrueshme për çdo spektator. Ne synojmë të kombinojmë teknologjinë më të avancuar, rehati maksimale dhe një shërbim të jashtëzakonshëm për të garantuar që çdo vizitë të jetë e veçantë. Qëllimi ynë është të krijojmë një ambient ku familjet, miqtë dhe dashamirët e filmave mund të bashkohen dhe të shijojnë filma të cilësisë së lartë në një sallë të përshtatshme dhe të rehatshme.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 hover:scale-105 transform transition">
            <img 
              img src="/public/vizioni.jpg" 
              alt="Vizionin tonë" 
              className="w-50 h-50 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Vizionin tonë</h3>
            <p className="text-gray-400 text-sm">
              Të bëhemi destinacioni kryesor për të gjithë adhuruesit e filmave duke sjellë eksperienca unike çdo herë.Vizioni ynë është të bëhemi pika kryesore e kulturës kinematografike në qytet, një destinacion ku të gjithë dashamirët e filmit ndihen si në shtëpi. Ne dëshirojmë që çdo vizitë të sjellë emocione të forta, frymëzim dhe kujtime të paharrueshme. Me fokus në inovacion dhe përmirësim të vazhdueshëm, synojmë të sjellim filmat më të fundit, klasikët e përjetshëm dhe evente të veçanta që lidhin komunitetin me magjinë e kinemasë.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
