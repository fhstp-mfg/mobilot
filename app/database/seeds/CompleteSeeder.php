<?php

use App\Models\Mobidul;
use App\Models\User;
use App\Models\Station; 
use App\Models\Attachment;
use App\Models\Category;
use App\Models\User2Mobidul;
use App\Models\Category2Station;
use App\Models\NavigationItem;


class CompleteSeeder extends Seeder {
 
    public function run()
	{
         
        
        \DB::table('navigationitems')->delete();
        \DB::table('user2mobidul')->delete();
        \DB::table('category2station')->delete();
        
        \DB::table('category')->delete();
        \DB::table('station')->delete();
        
		\DB::table('user')->delete();
        \DB::table('mobidul')->delete();
        
        
        //#################
        //MOBIDUL
        //#################
        
        
        $mobidul1=Mobidul::create(
			array (
				'name' => 'guide',
				'code' => 'guide',
                'minAccuracy'=> 100,
                'defaultPage_stationCode'=>'AllGeBra',
                'flagCodeSnippet'=>true,
                'flagScanCode'=>true,
                'flagGetByLocation'=>true,
                'flagGetByTime'=>false,
                'centerLat'=>48.18422587351,
                'centerLon'=>16.08575732002,
                'centerRadius'=>1000,
			));
        $mobidul2=Mobidul::create(
            array(
				'name' => 'wald',
				'code' => 'wald',
                'defaultPage_stationCode'=>'ahorn',
                'flagScanCode'=>true,
                'flagGetByLocation'=>true,
                'centerLat'=>48.234506906852,
                'centerLon'=>15.477418904399,
                'centerRadius'=>1000,	
		));
        
        //#################
        //USER
        //#################
        
        
        $user1=User::create(
			array (
				'username' => 'admin',
				'password' => Hash::make('m0b1l0t!'),
				'email' => ''
			)); 
        
        $user2=User::create(
			array (
				'username' => 'wald1',
				'password' => Hash::make('1234'),
				'email' => ''
			));
        $user3=User::create(
			array (
				'username' => 'wald2',
				'password' => Hash::make('1234'),
				'email' => ''
			)); 
        $user4=User::create(
			array (
				'username' => 'wald3',
				'password' =>  Hash::make('1234'),
				'email' => ''
			));
        $user4=User::create(
			array (
				'username' => 'wald4',
				'password' =>  Hash::make('1234'),
				'email' => ''
			));
        $user4=User::create(
			array (
				'username' => 'wald5',
				'password' =>  Hash::make('1234'),
				'email' => ''
			));
        $user4=User::create(
			array (
				'username' => 'wald6',
				'password' =>  Hash::make('1234'),
				'email' => ''
			));
        
        //#################
        //User2Mobidul
        //#################
        
		\DB::table('user2mobidul')->insert(array (
			0 => 
			array (
				'userId' => $user1->id,
				'mobidulId' => $mobidul1->id,
				'rights' => 1
			),
			1 => 
			array (
				'userId' => $user1->id,
				'mobidulId' => $mobidul2->id,
				'rights' => 1
			)
		));
        
        //###################
        //CATEGORY!!
        //###################
        
        $category1=Category::create(
			array (
				'name' => '&Ouml;ffentlich',
				'mobidulId' => $mobidul1->id,
				'created_at' => '2014-07-10 11:31:01',
				'updated_at' => '2014-07-10 11:31:01',
			)); 
        $category2=Category::create(
			array (
				'name' => 'Wirtschaft',
				'mobidulId' => $mobidul1->id,
				'created_at' => '2014-07-10 11:31:01',
				'updated_at' => '2014-07-10 11:31:01',
			)); 
        $category3=Category::create(
			array (
				'name' => 'Tourismus',
				'mobidulId' => $mobidul1->id,
				'created_at' => '2014-07-10 11:31:01',
				'updated_at' => '2014-07-10 11:31:01',
			));
        $category4=Category::create(
			array (
				'name' => 'Pflanze',
				'mobidulId' => $mobidul2->id,
				'created_at' => '2014-07-10 11:31:01',
				'updated_at' => '2014-07-10 11:31:01',
			)); 
        $category5=Category::create(
			array (
				'name' => 'Tier',
				'mobidulId' => $mobidul2->id,
				'created_at' => '2014-07-10 11:31:01',
				'updated_at' => '2014-07-10 11:31:01',
			));
        $category6=Category::create(
			array (
				'name' => 'Station',
				'mobidulId' => $mobidul2->id,
				'created_at' => '2014-07-10 11:31:01',
				'updated_at' => '2014-07-10 11:31:01',
			)); 
        
        //#################
        //STATION
        //#################
        
        
        
        $station1=Station::create(
			array (
				'code' => 'AllGeBra',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.18422587351380315112692187540233135223388671875,
				'lon' => 16.085757320022100458345448714680969715118408203125,
				'radius' => 1000,
				'name' => 'All-Ge-Bra',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**All-Ge-Bra Brandl KEG.**


Branche:

Unternehmensberatung

&nbsp;

Adresse:&nbsp;

Josef Kremslehner-Gasse 1

3021 Pressbaum

&nbsp;

',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station2=Station::create(
			array (
				'code' => 'almstueberl',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.20625693700760194815302384085953235626220703125,
				'lon' => 16.064178948497300325470860116183757781982421875,
				'radius' => 1000,
				'name' => 'Almstüberl Erika Berger',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Fr&uuml;hst&uuml;ckspension Almst&uuml;berl Erika Berger**

<img class="titelbild" src="../../upload/image/Almstueberl/almstueberl_image002.jpg" />


Branche:

G&auml;stehaus

&nbsp;

Adresse:

Rauchengern 4

3021 Pressbaum

&nbsp;

Gr&uuml;ndung:

1972

&nbsp;


*Geschichte des Unternehmens*

Seit &uuml;ber 300 Jahren ist dieses Objekt ein Bauernhof. Es wurde Acker- Wiesen- und Viehwirtschaft betrieben. Ab dem Jahr 1972, nach einem Umbau, setzt man zus&auml;tzlich auf Zimmervermietung. Als wir Kinder waren wurde die frisch gemolkene Milch in der Fr&uuml;h zu den Kundschaften in den Ort gebracht. Jetzt holen wir die Milch von den umliegenden Bauern.

<img src="../../upload/image/Almstueberl/almstueberl_image003.jpg" />
Blick auf das ganze Haus


1972 wurde nach einem Umbau die Fr&uuml;hst&uuml;ckspension er&ouml;ffnet. Seit dieser Zeit leben wir haupts&auml;chlich von der Zimmervermietung und freuen uns &uuml;ber die gute Auslastung. G&auml;ste aus den verschiedensten L&auml;ndern machten schon Urlaub in unserer Pension.

*Pl&auml;ne f&uuml;r die Zukunft*

Die Fr&uuml;hst&uuml;ckspension Almst&uuml;berl mit Liebe weiterf&uuml;hren!
',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station3=Station::create(
			array (
				'code' => 'aquaedukt_brentenmais',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.1761169447699018064668052829802036285400390625,
				'lon' => 16.0994768191333008644505753181874752044677734375,
				'radius' => 1000,
				'name' => 'Aquädukt über die Brentenmais',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Aqu&auml;dukt &uuml;ber die Pfalzau**


Erbauung

Zwischen 1907 und 1911

&nbsp;


*Teil der II. Wiener Hochquellwasserleitung*

<img alt="" src="../../upload/image/Aquaedukt/Pfalzau2.png" />â€‹
Hier sehen Sie eine schwarzwei&szlig;e Aufnahme des Aqu&auml;dukts


Immer noch imposant anzusehen, stellt das Pfalzauaqu&auml;dukt einen historischen Teil Pressbaums dar.

<img alt="" src="../../upload/image/Aquaedukt/Pfalzau.jpg" />â€‹
Dies ist eine aktuellere Darstellung

',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station4=Station::create(
			array (
				'code' => 'Arrakis',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.22024805329500196648950804956257343292236328125,
				'lon' => 16.02241158971740020433571771718561649322509765625,
				'radius' => 1000,
				'name' => 'Arrakis Software und Verwaltung GmbH',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Arrakis&nbsp;Software und Verwaltung GmbH**


Branche:

Software

&nbsp;

Adresse:&nbsp;

In der Bonna 3e

3443 Pressbaum

&nbsp;

',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station5=Station::create(
			array (
				'code' => 'Arzt_Barfuß',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.1843725163493985519380657933652400970458984375,
				'lon' => 16.0872888613696005677411449141800403594970703125,
				'radius' => 1000,
				'name' => 'Allgemeinmedizin Dr. Karin Barfuss',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Allgemeinmedizin

Dr. Karin Barfu&szlig;**


Branche:

Allgemeinmedizin und Hom&ouml;opathie

&nbsp;

Adresse:

Josef Kremslehner-Gasse 1

3021 Pressbaum

&nbsp;

Krankenkassen:

GKK | BVA | VA | SVA | KFA | SVB

&nbsp;

',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station6=Station::create(
			array (
				'code' => 'BajicBau',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.16131940553309931374315056018531322479248046875,
				'lon' => 16.072375779246801386079823714680969715118408203125,
				'radius' => 1000,
				'name' => 'Bajic Bau KG',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Bajic Bau KG**


Branche:

Baugewerbe

&nbsp;

Adresse:&nbsp;

Pfalzauer Stra&szlig;e 97

3021 Pressbaum

&nbsp;

',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station7=Station::create(
			array (
				'code' => 'bankaustria',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.180284000000000332875060848891735076904296875,
				'lon' => 16.0781019999999017500158515758812427520751953125,
				'radius' => 1000,
				'name' => 'UniCredit Bank Austria AG',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '** Diese eine Bank hat kein Geld, daür steht sie im Park**',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station8=Station::create(
			array (
				'code' => 'bartbergUnternehmensberatung',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.1780307246636994022992439568042755126953125,
				'lon' => 16.105356221293998686405757325701415538787841796875,
				'radius' => 1000,
				'name' => 'Bartberg Beratung',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Bartberg Beratung**


Branche:

Sportberatung im Trainings-, Animations- und Wettbewerbsbereich

&nbsp;

Adresse:&nbsp;

Josef Kremslehner-Gasse 11

3021 Pressbaum

&nbsp;

',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station9=Station::create(
			array (
				'code' => 'bauergaussMarcellus',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.1811820457842969744888250716030597686767578125,
				'lon' => 16.058728699779099002853399724699556827545166015625,
				'radius' => 1000,
				'name' => 'Bauer-Gauss Marcellus',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Bauer-Gauss Marcellus**


Branche:

Restaurierung von Weichholzm&ouml;bel

&nbsp;

Adresse:&nbsp;

Haitzawinkel 12

3021 Pressbaum

&nbsp;

',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station10=Station::create(
			array (
				'code' => 'BP_Pressbaum',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.1804237433043027749590692110359668731689453125,
				'lon' => 16.078555588817199151208114926703274250030517578125,
				'radius' => 1000,
				'name' => 'BP Tankstelle',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**BP Tankstelle**


Branche:

Tankstelle

&nbsp;

Adresse:&nbsp;

Hauptstra&szlig;e 54

3021 Pressbaum

&nbsp;

',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station11=Station::create(
			array (
				'code' => 'Denkmal_KaiserJoseph',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.17888587590920224101864732801914215087890625,
				'lon' => 16.077067136764501498191748396493494510650634765625,
				'radius' => 1000,
				'name' => 'Denkmal von Kaiser Joseph II.',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Denkmal von

Kaiser Joseph II.**


&nbsp;

Erbauung:

1885

&nbsp;


*Zu finden vor der &ouml;ffentlichen Volksschule Pressbaum*


<img alt="" src="../../upload/image/Kaiser_Joseph_II/IMG_2547.JPG" />
In Gedenken an Kaiser Joseph II.
',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station12=Station::create(
			array (
				'code' => 'Drucktechnik_Szerencsics',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.1800910882050033023915602825582027435302734375,
				'lon' => 16.084778313731700194466611719690263271331787109375,
				'radius' => 1000,
				'name' => 'Drucktechnik Szerencsics Werbeprint GmbH',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Drucktechnik Szerencsics Werbeprint GmbH**


Branche:

Drucktechnik

&nbsp;

Adresse:&nbsp;

F&uuml;nkhgasse 41e

3021 Pressbaum

&nbsp;


<img src="../../upload/image/Drucktechnik_Szerencsics/Logo.png" />
',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station13=Station::create(
			array (
				'code' => 'FahrschulePressbaum',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.17868890535149972720319055952131748199462890625,
				'lon' => 16.076425914859299837189610116183757781982421875,
				'radius' => 1000,
				'name' => 'Fahrschule Pressbaum',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Fahrschule Pressbaum**


Branche:

Fahrschule

&nbsp;

Betreiber:

Stefan Rathmanner

&nbsp;

Adresse:

Hauptstra&szlig;e 60

3021 Pressbaum

&nbsp;

&nbsp;

',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station14=Station::create(
			array (
				'code' => 'fotognaser',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.1833850000000012414602679200470447540283203125,
				'lon' => 16.091065000000099871613201685249805450439453125,
				'radius' => 1000,
				'name' => 'Foto Gnaser',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**â€‹Foto Gnaser**


Branche:

Fotografie

&nbsp;

Adresse:

Hauptstra&szlig;e 7

3021 Pressbaum

&nbsp;

Gr&uuml;ndung:

1951

&nbsp;


*Das Wirtschaftsunternehmen Gnaser...*

**<img alt="" src="../../upload/image/Foto_Gnaser/Gnaser_Geschaft_1951.jpg" style="opacity: 0.9;" />...wird in vierter Generation von Herrn Thomas Gnaser gef&uuml;hrt.**

Der Familienbetrieb hat von der Plattenverfahren bis zur Digitalfotografie alles erlebt!



Foto Gnaser hat es sich zur Aufgabe gemacht die Nahversorgung der PressbaumerInnen,

sowie der umliegenden Umgebung in allen fotografischen Belangen zu gew&auml;hrleisten.

**<img alt="" src="http://guide.hlwpressbaum.at/upload/image/Foto_Gnaser/Gnaser_Visit_2010_neu_Handy1.jpg" style="opacity: 0.9;" />â€‹**
',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station15=Station::create(
			array (
				'code' => 'Friedhof_scp',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.17796080495470079085862380452454090118408203125,
				'lon' => 16.062484741210898420149533194489777088165283203125,
				'radius' => 1000,
				'name' => 'Friedhof Sacre Coeur',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Alter Nonnenfriedhof beim&nbsp;Sacre Coeur**


Branche:

Friedhof

&nbsp;

Adresse:

Klostergasse 12

3021 Pressbaum

&nbsp;

Erbauung:

1879

&nbsp;


*<img alt="" src="../../upload/image/Friedhof/Friedohfbild_01.jpg" style="font-size: 13px; line-height: 1.6em;" />*

Alter Nonnenfriedhof, dieser ist heute nicht mehr in Benutzung.
',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station16=Station::create(
			array (
				'code' => 'Friseur_Beatrix_Aschauer',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.20422622741710227955991285853087902069091796875,
				'lon' => 16.067440514659399042329823714680969715118408203125,
				'radius' => 1000,
				'name' => 'Beatrix Aschauer',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Beatrix Aschauer**


Branche:

Friseur

&nbsp;

Adresse:

Rauchengern 11

3021 Pressbaum

&nbsp;

',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station17=Station::create(
			array (
				'code' => 'GaestezimmerFam.Breitner',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.17959388999999958969056024216115474700927734375,
				'lon' => 16.0740280200000000832005753181874752044677734375,
				'radius' => 1000,
				'name' => 'Gästezimmer Familie Breitner',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**G&auml;stezimmer Fam. Breitner**


Branche: Fremdenzimmer

&nbsp;

Adresse: Hauptstra&szlig;e 123

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 3021 Pressbaum

&nbsp;

Gr&uuml;ndung: _Datum_

&nbsp;


*Unter&uuml;berschirft*

Text

Hier kann ein normales Bild rein
Bildbeschreibung


Text

*Unter&uuml;berschirft*

Text.
',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station18=Station::create(
			array (
				'code' => 'Heimatmuseum',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.06061248316930090140886022709310054779052734375,
				'lon' => 16.116729736328100131004248396493494510650634765625,
				'radius' => 1000,
				'name' => 'Heimatmuseum',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Heimatmuseum**


Branche:Kultur

&nbsp;

Adresse:Hauptstra&szlig;e 79&nbsp; 3021 Pressbaum

&nbsp;

Gr&uuml;ndung:Am 19. Sep. 1959 erfolgte die Gr&uuml;ndung des Museums. 


<img alt="" src="http://guide.hlwpressbaum.at/upload/image/Heimatmuseum/heimatmuseum_ausstellungsbeitrag_1.jpg" />

Im ehemaligen Amtshaus der Gemeinde wurden, &nbsp;f&uuml;r 700 Exponate geeignete R&auml;ume gefunden. Am 19. Sep. 1959 wurde ein Museum er&ouml;ffnet. 1967 musste das Amtshaus einem Neubau weichen. Erst am 7. Sep. 1975 konnte das Museum am gleichen Standort wieder er&ouml;ffnet werden, jedoch mit wesentlich kleinerer Schaufl&auml;che. Es ist somit sicherlich eines der kleinsten Museen Nieder&ouml;sterreichs.

<img alt="" src="http://guide.hlwpressbaum.at/upload/image/Heimatmuseum/heimatmuseum_ausstellungsbeitrag_2.jpg" />

1981 gelang es durch das Entgegenkommen des B&uuml;rgermeisters&nbsp;Dipl.Ing. Dr. Otto Hartmann, im Foyer des Rathauses eine Ausstellungsfl&auml;che einzurichten. Hier werden durchschnittlich viermal im Jahr Exponate zu m&ouml;glichst aktuellen Anl&auml;ssen, die Pressbaum oder Nieder&ouml;sterreich betreffen, gezeigt.

<img alt="" src="http://guide.hlwpressbaum.at/upload/image/Heimatmuseum/heimatmuseum_ausstellungsbeitrag_3.jpg" />
',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station19=Station::create(
			array (
				'code' => 'hlwpressbaum',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.18059543541419742496145772747695446014404296875,
				'lon' => 16.08252525815920108698264812119305133819580078125,
				'radius' => 1000,
				'name' => 'HLW Pressbaum',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**HLW Pressbaum**


Branche:

H&ouml;here Lehranstalt f&uuml;r wirtschaftliche Berufe

&nbsp;

Adresse:

F&uuml;nkhgasse 45a

3021 Pressbaum

&nbsp;

Gr&uuml;ndung:

2011

&nbsp;


*Die Gr&uuml;ndung*

Die HLW Pressbaum wurde auf Initiative von Inge Dirnbacher im Sommer 2011 gegr&uuml;ndet und startete mit einer Klasse ins Schuljahr 2011/12.

<img alt="" src="../../upload/image/HLW_Pressbaum/HLW_Schulhaus-Rckansicht1.jpg" />â€‹

Hier sehen Sie das Schulhaus im Gr&uuml;ndungsjahr

*Lehrer und Sch&uuml;ler*

Die HLW Pressbaum ist gepr&auml;gt, durch engagierte Lehrer und wissbegierige Sch&uuml;ler.

Erst diese Kombination, macht es m&ouml;glich Projekte, wie den historischen Pressbaumer Stadtf&uuml;hrer, zu realisieren!

<img alt="" src="../../upload/image/HLW_Pressbaum/Lehrerfoto-2012-Ausschnitt-HP.jpg" />

das Kollegium im Schuljahr 2012/13

*Unsere neue K&uuml;che...*

ist seit Oktober 2012 fertiggestellt und wird flei&szlig;ig benutzt!

Der beliebte fachpraktische Unterricht bildet einen wichtigen Eckpfeiler unseres Schultyps und lockert den Schulalltag f&uuml;r die Sch&uuml;ler auf.

<img alt="" src="../../upload/image/HLW_Pressbaum/Kche2.jpg" />

Hier sehen Sie unsere neue Restaurantk&uuml;che
',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station20=Station::create(
			array (
				'code' => 'holdoptik',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.1842008368900991399641497991979122161865234375,
				'lon' => 16.092696194743698612228399724699556827545166015625,
				'radius' => 1000,
				'name' => 'Hold Optik',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Hold Optik**


Branche:

Optiker

&nbsp;

Adresse:

Hauptstra&szlig;e 49

3013 Tullnerbach

&nbsp;

&Ouml;ffnungszeiten:

Montag, Dienstag, Mittwoch u. Freitag 9.00 - 18.00
&nbsp;
Donnerstag und Samstag 9.00 - 12.00

&nbsp;

Gr&uuml;ndung:

2007

&nbsp;


<img alt="" src="../../upload/image/Holdoptik/Holdoptik1.png" />â€‹

&nbsp;

<img alt="" src="../../upload/image/Holdoptik/holdoptik_historisch.jpg" />
Aufname ca. gegen 1950


Hier sehen Sie eine historische Aufnahme der Geb&auml;udes, in dessen rechtem Teil sich seit 2007 das Unternehmen Hold Optik befindetâ€‹

*Kontaktinformationen:*

<img alt="" src="../../upload/image/Holdoptik/holdoptik2.png" />â€‹

<a href="https://www.facebook.com/pages/Hold-Optik/129446450405929?ref=ts&amp;fref=ts" target="_blank">Finden Sie uns auf Facebook!</a>
',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station21=Station::create(
			array (
				'code' => 'Ingeneurbuero_Brandstetter',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.185610022106601491032051853835582733154296875,
				'lon' => 16.05915785322140010293878731317818164825439453125,
				'radius' => 1000,
				'name' => 'Ingenieurbüro DI Fritz Brandstetter',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Ingenieurb&uuml;ro DI Fritz Brandstetter**


Gr&uuml;ndung:&nbsp;

2003

&nbsp;

Branche:&nbsp;

Technisches B&uuml;ro, Consulting

Adresse:&nbsp;

Haitzawinkel 5a

3021 Pressbaum

&nbsp;

Kontaktinformationen:&nbsp;

&nbsp;

0664 113453

fb@ib-brandstetter.at

<a href="â€œwww.energie-beratung-konzept.infoâ€">www.energie-beratung-konzept.info</a>

&nbsp;

&nbsp;

&nbsp;

&nbsp;

<img src="../../upload/image/Ingenieurbuero_Brandstetter/Logo_Ingenieurbuero_Brandstetter.jpg" />

&nbsp;

*Wir bieten Ihnen...*

&nbsp;

... neben Energieberatung, Energieausweis, Thermographie, Baubegleitung und Passivhausberatung, umfassendes Service und Betreuung

&nbsp;

<img src="../../upload/image/Ingenieurbuero_Brandstetter/Logo2_Ingenieurbuero_Brandstetter.jpg" />

',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station22=Station::create(
			array (
				'code' => 'kaiserbruenndl',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.16136680999999697405655751936137676239013671875,
				'lon' => 16.038038809999999756428223918192088603973388671875,
				'radius' => 1000,
				'name' => 'Kaiserbrünndl',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Schulzentrum Sacre Coeur**


Branche:

Bildungsanstalt

&nbsp;

Adresse:&nbsp;

Klostergasse 12

3021 Pressbaum

&nbsp;

Gr&uuml;ndung:

1686

&nbsp;


<img alt="" src="../../upload/image/Schulzentrum_Sacre_Coure/Schulzentrum_Sacre_coure_frher_1.jpg" />â€‹
Historische Aufnahme der Frontseite


<img alt="" src="../../upload/image/Schulzentrum_Sacre_Coure/Schulzentrum_Sacre_coure_frher_2.jpg" />â€‹

&nbsp;

&nbsp;

<img alt="" src="../../upload/image/Schulzentrum_Sacre_Coure/Schulzentrum_Sacre_coure_heute.jpg" />â€‹
Heute gibt es ein Gymnasium, eine Mittelschule, eine Volksschule, einen Kindergarten, eine Bakip, ein Colleg, ein Internat und einen Hort

',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station23=Station::create(
			array (
				'code' => 'mariasfashion',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.1476844318487025020658620633184909820556640625,
				'lon' => 16.065187459086899934845860116183757781982421875,
				'radius' => 1000,
				'name' => 'Maria\'s Fashion',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Maria&#39;s Fashion**


Branche:

Einzelhandlung Bekleidung

&nbsp;

Adresse:&nbsp;

Pfalzauerstra&szlig;e 156

3021 Pressbaum

&nbsp;

',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station24=Station::create(
			array (
				'code' => 'omvtankstelle_grosram',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.16363448605920183354101027362048625946044921875,
				'lon' => 16.0051435280795004700848949141800403594970703125,
				'radius' => 1000,
				'name' => 'OMV Tankstelle',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**OMV Tankstelle Gro&szlig;ram**


Branche:

Tankstelle

&nbsp;

Adresse:

Gro&szlig;ram 1

3021 Pressbaum

&nbsp;

',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station25=Station::create(
			array (
				'code' => 'orgelbau_niemeczek',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.18102466317319709787625470198690891265869140625,
				'lon' => 16.07128143796879982119207852520048618316650390625,
				'radius' => 1000,
				'name' => 'Der Orgelbau im Wienerwald',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Der Orgelbau im Wienerwald

Orgelbaumeister Robert Niemeczek**


Branche:

Musikinstrumentenbau

&nbsp;

Adresse:&nbsp;

Siedlungsstra&szlig;e 19

3021 Pressbaum

&nbsp;

Gr&uuml;ndung:

2002

&nbsp;


*Ein historisches Haus*

<img alt="" src="../../upload/image/Orgelbau_Niemeczek/orgelbau_Bild_1_Haus_1914.jpg" />â€‹
Ansicht des Wohnhauses &ndash; Siedlungsstra&szlig;e 19 im Jahre 1914 in Richtung Karriegel &ndash; nach Norden &ndash; mit Waschk&uuml;che und H&uuml;hnerstall im Hintergrund


*Die Entwicklung des Unternehmens*

Von Beginn an lag der Schwerpunkt beim Instandsetzen und Restaurieren historischer Kirchenorgeln vorwiegend im Osten &Ouml;sterreichs &ndash; so z.B.: Johannesberg, Atzenbrugg, Irenental. 2007 bauten wir die neue Orgel der Pfarre Wolfsgraben. Neben dieser sehr interessanten und verantwortungsvollen Arbeit haben wir uns im Bereich der mechanischen Musikinstrumente, insbesondere der Drehorgeln stark entwickelt. Besonders beliebt sind unsere kleinen, umh&auml;ngbaren 20 Tonstufen Bauchorgeln, zu sehen auf unserer Homepage.

<img alt="" src="../../upload/image/Orgelbau_Niemeczek/orgelbau_Bild_3_Haus_und_Werkstatt_2012.jpg" />â€‹
Ansicht des Wohnhauses &ndash; Siedlungsstra&szlig;e 19 im Jahre 2012


*Unsere Pl&auml;ne f&uuml;r die Zukunft sind...*

...die Erhaltung historisch wertvoller Instrumente sowohl im Bereich der Kirchenorgeln als auch im Bereich der mechanischen Musikinstrumente
',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station26=Station::create(
			array (
				'code' => 'pfarrkirche',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.17903700000000100089891930110752582550048828125,
				'lon' => 16.077602000000098314558272249996662139892578125,
				'radius' => 1000,
				'name' => 'Pfarrkirche Pressbaum',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Pfarrkirche Pressbaum**


Kategorie:

Tourismus

&nbsp;

Adresse:

Hauptstra&szlig;e 75a

3021 Pressbaum

&nbsp;

Gr&uuml;ndung:

1783

&nbsp;


*Geschichte*

Die Pfarre Pressbaum wurde wie viele Pfarren in der Erzdi&ouml;zese Wien im Jahre 1783 gegr&uuml;ndet, um den Menschen die oft weiten Wege in die Sonntagsmesse zu verk&uuml;rzen.

Bis zum Bau der ersten Kirche in Pressbaum traf man sich bei einem f&uuml;r eine gro&szlig;e Presse vorgesehen Baumstamm, dem sogenannten &bdquo;Pressbaum&ldquo;, um von dort gemeinsam nach Purkersdorf in die Heilige Messe zu wandern.

Die heutige der Heiligsten Dreifaltigkeit geweihte Pfarrkirche wurde 1908 zur Feier des 60. Regierungsjahres Kaiser Franz Josefs errichtet und ersetzte die alte kleine den Pestheiligen Rochus, Sebastian und Rosalia geweihte Kirche, die aus dem Jahr 1730 stammte, und von den hier wohnenden &bdquo;H&uuml;ttlern&ldquo; auch &bdquo;Maria im Walde&ldquo; genannt wurde.

<img src="../../upload/image/Pfarrkirche/pfarrkirche1.jpg" />
Die Pfarrkirche neu und alt um 1908


Die Pfarrkirche ist die einzige Jugendstilkirche Nieder&ouml;sterreichs und wurde nach einem Entwurf von August Rehak und Max Hegele errichtet.

<img src="../../upload/image/Pfarrkirche/pfarrkirche_zeichnung.jpg" />
Die Pfarrkirche als Zeichnung der VS Pressbaum


Quelle: <a href="http://www.pfarrepressbaum.at/geschichte.html" target="_blank">pfarrepressbaum.at</a>

&nbsp;


Unser Tipp:

Informieren Sie sich &uuml;ber das Pfarrleben der Pfarrgemeinde Pressbaum &uuml;ber die Aush&auml;nge auf den zwei Anschlagtafeln links vom Kircheneingang!

',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station27=Station::create(
			array (
				'code' => 'polizeiposten ',
				'mobidulId' => $mobidul1->id,
				'lat' => 48.1794385244131007084433804266154766082763671875,
				'lon' => 16.076841831207300259620751603506505489349365234375,
				'radius' => 1000,
				'name' => 'Polizeiposten ',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Polizeiposten**


Branche:

&Ouml;ffentlicher Dienst

&nbsp;

Hauptstra&szlig;e 58

3021 Pressbaum

&nbsp;

Gr&uuml;ndung:

_Datum_

&nbsp;

&nbsp;

<img alt="" src="http://guide.hlwpressbaum.at/upload/image/Polizeiposten/Polizeiposten_01.JPG" />

&nbsp;

Fr&uuml;her fand man den Polizeiposten neben der Gemeinde, heute befindet er sich direkt darin.

',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station28=Station::create(
			array (
				'code' => 'ahorn',
				'mobidulId' => $mobidul2->id,
				'lat' => 48.2345069068523031319273286499083042144775390625,
				'lon' => 15.477418904399399934845860116183757781982421875,
				'radius' => 1000,
				'name' => 'Ahorn',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Ahorn**

Die *Ahorne* (_Acer_) bilden eine <a href="http://de.wikipedia.org/wiki/Gattung_%28Biologie%29" title="Gattung (Biologie)">Pflanzengattung</a> in der Unterfamilie der <a href="http://de.wikipedia.org/wiki/Rosskastaniengew%C3%A4chse" title="Rosskastaniengewächse">Rosskastaniengew&auml;chse</a> (Hippocastanoideae) innerhalb der Familie der <a href="http://de.wikipedia.org/wiki/Seifenbaumgew%C3%A4chse" title="Seifenbaumgewächse">Seifenbaumgew&auml;chse</a> (Sapindaceae). Je nach Autor gibt es 110 bis 200 Ahorn-Arten. Sie sind in gem&auml;&szlig;igten und tropischen Gebieten in Eurasien, Nordafrika, Zentral- und Nordamerika weitverbreitet. Viele Arten werden vielseitig genutzt.

<a href="http://upload.wikimedia.org/wikipedia/commons/5/5f/Ahorn_im_Wandel_der_Jahreszeiten.jpg"><img alt="Ahorn im Wandel der Jahreszeiten" src="http://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Ahorn_im_Wandel_der_Jahreszeiten.jpg/799px-Ahorn_im_Wandel_der_Jahreszeiten.jpg" style="width: 200px; height: 44px;" /></a>

*Erscheinungsbild und Bl&auml;tter*

Ahorn-Arten wachsen als meist sommergr&uuml;ne oder seltener immergr&uuml;ne <a href="http://de.wikipedia.org/wiki/Baum" title="Baum">B&auml;ume</a> oder <a href="http://de.wikipedia.org/wiki/Strauch" title="Strauch">Str&auml;ucher</a>.<a href="http://de.wikipedia.org/wiki/Ahorn#cite_note-FoC-1">[1]</a>

Die gegenst&auml;ndig angeordneten <a href="http://de.wikipedia.org/wiki/Blatt_%28Pflanze%29" title="Blatt (Pflanze)">Laubbl&auml;tter</a> sind in Blattstiel und Blattspreite gegliedert. Die meist einfache Blattspreite ist meist handf&ouml;rmig gelappt. Manche Arten besitzen unpaarig gefiederte Blattspreiten, mit drei oder f&uuml;nf Bl&auml;ttchen, zum Beispiel der <a href="http://de.wikipedia.org/wiki/Eschen-Ahorn" title="Eschen-Ahorn">Eschen-Ahorn</a> (_Acer negundo_). Es liegt eine handf&ouml;rmige Nervatur vor. Der Blattrand ist glatt oder gez&auml;hnt. Es sind keine <a href="http://de.wikipedia.org/wiki/Nebenblatt" title="Nebenblatt">Nebenbl&auml;tter</a> vorhanden.<a href="http://de.wikipedia.org/wiki/Ahorn#cite_note-FoC-1">[1]</a> Viele Arten besitzen eine intensive Herbstf&auml;rbung des Laubes.

*Bl&uuml;tenst&auml;nde und Bl&uuml;ten*

Die Bl&uuml;ten stehen in <a href="http://de.wikipedia.org/wiki/Traube#Schirmtraube" title="Traube">schirmtraubigen</a> oder <a href="http://de.wikipedia.org/wiki/Dolde" title="Dolde">doldigen</a>, seltener <a href="http://de.wikipedia.org/wiki/Traube" title="Traube">traubigen</a> oder gro&szlig;en <a href="http://de.wikipedia.org/wiki/Rispe" title="Rispe">rispigen</a> <a href="http://de.wikipedia.org/wiki/Bl%C3%BCtenstand" title="Blütenstand">Bl&uuml;tenst&auml;nden</a> zusammen.<a href="http://de.wikipedia.org/wiki/Ahorn#cite_note-FoC-1">[1]</a>

Die <a href="http://de.wikipedia.org/wiki/Bl%C3%BCte" title="Blüte">Bl&uuml;ten</a> sind selten zwittrig, sondern meist funktional eingeschlechtig. Die <a class="mw-redirect" href="http://de.wikipedia.org/wiki/Radi%C3%A4rsymmetrisch" title="Radiärsymmetrisch">radi&auml;rsymmetrischen</a> Bl&uuml;ten sind meist f&uuml;nfz&auml;hlig mit doppelter <a href="http://de.wikipedia.org/wiki/Bl%C3%BCtenh%C3%BClle" title="Blütenhülle">Bl&uuml;tenh&uuml;lle</a> (Perianth). Es sind meist f&uuml;nf, selten vier oder sechs <a class="mw-redirect" href="http://de.wikipedia.org/wiki/Kelchbl%C3%A4tter" title="Kelchblätter">Kelchbl&auml;tter</a> vorhanden. Es sind meist f&uuml;nf, selten vier oder sechs <a class="mw-redirect" href="http://de.wikipedia.org/wiki/Kronbl%C3%A4tter" title="Kronblätter">Kronbl&auml;tter</a> vorhanden, selten fehlen sie. Es sind meist acht, selten vier, f&uuml;nf, zehn oder zw&ouml;lf freie <a href="http://de.wikipedia.org/wiki/Staubblatt" title="Staubblatt">Staubbl&auml;tter</a> vorhanden. Zwei Fruchtbl&auml;tter sind zu einem oberst&auml;ndigen Fruchtknoten verwachsen. Je Fruchtblatt gibt es selten eine, meist zwei <a href="http://de.wikipedia.org/wiki/Samenanlage" title="Samenanlage">Samenanlagen</a>. Der Griffel ist meist zweigabelig und es sind zwei Narben vorhanden.<a href="http://de.wikipedia.org/wiki/Ahorn#cite_note-FoC-1">[1]</a> Man unterscheidet zwischen insekten- und windbest&auml;ubten Arten. Bei insektenbest&auml;ubten (<a href="http://de.wikipedia.org/wiki/Entomophilie" title="Entomophilie">Entomophilie</a>) Arten ist am Grunde der Bl&uuml;ten ein Diskus vorhanden, denn er dient der Anlockung von Insekten.

*Fr&uuml;chte und Samen*

Es werden <a href="http://de.wikipedia.org/wiki/Spaltfrucht" title="Spaltfrucht">Spaltfr&uuml;chte</a> gebildet, die als zwei gefl&uuml;gelte Nussfr&uuml;chte (<a href="http://de.wikipedia.org/wiki/Fl%C3%BCgelnuss_%28Botanik%29" title="Flügelnuss (Botanik)">Samara</a>) abfallen.Die Frucht f&uuml;hrt durch ihre spezielle aerodynamische Form (<a class="mw-redirect" href="http://de.wikipedia.org/wiki/Monopteros_%28Windkraftanlage%29" title="Monopteros (Windkraftanlage)">Monopteros</a>) beim Herunterfallen zu <a href="http://de.wikipedia.org/wiki/Autorotation" title="Autorotation">Autorotation</a>, dieses bewirkt ein langsameres Absinken der Samen und eine gro&szlig;fl&auml;chige Verteilung der <a href="http://de.wikipedia.org/wiki/Diaspore" title="Diaspore">Diasporen</a> durch den Wind.

*Quiz*

Bei windbest&auml;ubten Ahornarten ist am Grunde der Bl&uuml;ten ein Diskus.

(l) Wahr
	(i) Falsch


Ahornb&auml;ume gibt es auf allen Kontinenten der Erde

(s) Wahr',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        
       
        $station31=Station::create(
			array (
				'code' => 'hohenegg',
				'mobidulId' => $mobidul2->id,
				'lat' => 48.2343353953796025734845898114144802093505859375,
				'lon' => 15.4772043276781996468116631149314343929290771484375,
				'radius' => 1000,
				'name' => 'Burgruine Hohenegg',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**<strong>Geschichte der Burg Hohenegg</strong>**

Die Geschichte der Burg Hohenegg reicht sehr weit zur&uuml;ck. Sie wird hier ab der &Uuml;bernahme durch die Familie Montecuccoli kurz dargestellt.

<img alt="Ruine Hafnerbach" src="http://www.hafnerbach.gv.at/uploads/pics/RuineHohenegg1.jpg" style="width: 301px; height: 204px;" />

Bedingt durch die eingeleitete Gegenreformation Kaiser Ferdinands II musste der Protestant Neuhaus Hohenegg 1629 die Burg an die verwitwete Gr&auml;fin Barbara Gienger, geborene Concin, in zweiter Ehe verheiratet mit dem geheimen Rat und K&auml;mmerer Girolamo (Hieronymus) Montecuccoli, um 67 000 Gulden und 200 Dukaten Leihkauf ver&auml;u&szlig;ern.

Ferdinand II l&ouml;ste zugunsten der in Hof- und Kriegsdiensten ausgezeichneten Familie Montecuccoli Hohenegg vom Lehensband und erhob die Herrschaft zu einem freien Allodialgut. Als Graf Hieronymus 1643 starb, erbte der Neffe Raimondo (Raimund, 1609-1680) an Sohnes statt.

<img alt="" src="http://www.arge-dunkelsteinerwald.at/uploads/pics/Weinhofer-Hohenegg_1_02.JPG" style="width: 301px; height: 200px;" />

Quiz

Wie alt wurde Raimondo?

(f) 91
	(h) 71
	(b) 4',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station32=Station::create(
			array (
				'code' => 'mammutbaum',
				'mobidulId' => $mobidul2->id,
				'lat' => 48.36970733615549988826387561857700347900390625,
				'lon' => 15.553550725078100214204823714680969715118408203125,
				'radius' => 1000,
				'name' => 'Göttweiger Mammutbäume',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**G&ouml;ttweiger Mammutb&auml;ume**

Im Jahr 1880 legte der sp&auml;tere Abt Adalbert Dungel mehrere Samen der Wellingtonia gigantea auf dem Plateau des vom Ortszentrum &ouml;stlich gelegenen Eichberg in die Erde. Heute geh&ouml;ren die Mammutb&auml;ume, die so genannten Adalbert-Wellingtonien, zu den gr&ouml;&szlig;ten zusammenstehenden Best&auml;nden in Mitteleuropa. Die G&ouml;ttweiger-Wald-Erlebniswelt wurde am 22. Oktober 2004 vom Forstbetrieb Stift G&ouml;ttweig, dem Land Nieder&ouml;sterreich und dem &Ouml;kogymnasium der Englischen Fr&auml;ulein in Krems er&ouml;ffnet. Die Besucher haben die M&ouml;glichkeit &uuml;ber 30 verschiedene heimische Baum- und Straucharten kennenzulernen und Hintergrundinformationen zu bekommen. Zudem gibt es im Arboretum, dem Baumgarten bei den Mammutb&auml;umen, die M&ouml;glichkeit, weitere 50 Baumarten aus aller Welt zu betrachten. (Wikipedia)

<img alt="" src="http://www.pfarre-paudorf.com/assets/images/Mammutbaume.jpg" style="width: 227px; height: 225px;" />

*Quiz*

Welcher Baumart geh&ouml;ren die Mammutb&auml;ume an?

(at) Adalbertonien
	(it) Dungeltonien

',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			));
        
        $station36=Station::create(
			array (
				'code' => 'rehtext',
				'mobidulId' => $mobidul2->id,
				'lat' => 48.2930159029640009293871116824448108673095703125,
				'lon' => 15.526084904765600214204823714680969715118408203125,
				'radius' => 1000,
				'name' => 'Reh',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => '**Reh**

Das *Reh* (_Capreolus capreolus_), zur Unterscheidung vom <a href="http://de.wikipedia.org/wiki/Sibirisches_Reh" title="Sibirisches Reh">Sibirischen Reh</a> auch *Europ&auml;isches Reh* genannt, ist eine &uuml;berwiegend auf dem europ&auml;ischen Kontinent vorkommende <a href="http://de.wikipedia.org/wiki/Hirsche" title="Hirsche">Hirschart</a>. In Mitteleuropa ist es der h&auml;ufigste und gleichzeitig kleinste Vertreter der Hirsche.

<img alt="" src="http://www.kidsnet.at/jpg/rehkitz1.JPG" style="width: 362px; height: 238px;" />

Das Reh besiedelte urspr&uuml;nglich Waldrandzonen und -lichtungen, es hat sich aber erfolgreich eine Reihe sehr unterschiedlicher Habitate erschlossen und kommt mittlerweile auch in offener, fast deckungsloser Agrarsteppe vor. Aufgeschreckte Rehe suchen gew&ouml;hnlich mit wenigen, schnellen Spr&uuml;ngen Schutz in Dickichten, es wird deswegen und auf Grund einiger morphologischer Merkmale dem sogenannten &bdquo;<a class="new" href="http://de.wikipedia.org/w/index.php?title=Schl%C3%BCpfertypus&amp;action=edit&amp;redlink=1" title="Schlüpfertypus (Seite nicht vorhanden)">Schl&uuml;pfertypus</a>&ldquo; zugerechnet. Rehe sind <a href="http://de.wikipedia.org/wiki/Wiederk%C3%A4uer" title="Wiederkäuer">Wiederk&auml;uer</a> und werden als Konzentratselektierer bezeichnet, da sie bevorzugt eiwei&szlig;reiches Futter <a href="http://de.wikipedia.org/wiki/%C3%84sung" title="Ã„sung">&auml;sen</a>. W&auml;hrend des Sommerhalbjahrs lebt das Reh &uuml;berwiegend einzeln oder in kleinen Gruppen, bestehend aus einer Ricke und ihren Kitzen, im Winter bilden sich Spr&uuml;nge, die meist nicht mehr als drei oder vier Tiere umfassen. Rehe, die in der offenen Agrarlandschaft leben, bilden aber auch Spr&uuml;nge von mehr als zwanzig Individuen.

Das Reh unterliegt dem <a href="http://de.wikipedia.org/wiki/Jagdrecht" title="Jagdrecht">Jagdrecht</a> und wird dort dem <a class="mw-redirect" href="http://de.wikipedia.org/wiki/Schalenwild" title="Schalenwild">Schalenwild</a> zugeordnet. Jagdrechtlich z&auml;hlt es zum <a class="mw-redirect" href="http://de.wikipedia.org/wiki/Niederwild" title="Niederwild">Niederwild</a>, die <a href="http://de.wikipedia.org/wiki/Jagdstrecke" title="Jagdstrecke">Jagdstrecke</a> betr&auml;gt allein auf dem Gebiet Deutschlands j&auml;hrlich mehr als eine Million St&uuml;ck. In der <a href="http://de.wikipedia.org/wiki/Landwirtschaftliche_Wildhaltung" title="Landwirtschaftliche Wildhaltung">landwirtschaftlichen Wildhaltung</a> spielt es auf Grund seiner Verhaltensmerkmale keine Rolle.

*Quiz*

Wie nennt man junge Rehe?

(p) Ricke
	(r) Kitz


Welchen Lebensraum bevorzugen Rehe?

(e) Waldlichtungen
	(g) Stra&szlig;enr&auml;nder


Rehe sind

(g) immer einzeln unterwegs
	(i) vom Jagdrecht ausgenommen

',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        $station37=Station::create(
			array (
				'code' => 'wildschweindi',
				'mobidulId' => $mobidul2->id,
				'lat' => 48.3149395108871004822503891773521900177001953125,
				'lon' => 15.5624771166797000176984511199407279491424560546875,
				'radius' => 1000,
				'name' => 'Wildschwein',
				'enabled' => 1,
				'contentType' => 'html',
				'content' => 'Das *Wildschwein* (_Sus scrofa_) geh&ouml;rt zur <a href="http://de.wikipedia.org/wiki/Familie_%28Biologie%29" title="Familie (Biologie)">Familie</a> der altweltlichen oder <a href="http://de.wikipedia.org/wiki/Echte_Schweine" title="Echte Schweine">echten Schweine</a> (Suidae) aus der <a href="http://de.wikipedia.org/wiki/Ordnung_%28Biologie%29" title="Ordnung (Biologie)">Ordnung</a> der Paarhufer. Das urspr&uuml;ngliche Verbreitungsgebiet der Art reicht von Westeuropa bis S&uuml;dost-<a href="http://de.wikipedia.org/wiki/Asien" title="Asien">Asien</a>, durch Einb&uuml;rgerungen in <a href="http://de.wikipedia.org/wiki/Nordamerika" title="Nordamerika">Nord-</a> und <a href="http://de.wikipedia.org/wiki/S%C3%BCdamerika" title="Südamerika">S&uuml;damerika</a>, <a href="http://de.wikipedia.org/wiki/Australien" title="Australien">Australien</a> sowie auf zahlreichen Inseln ist es heute fast weltweit verbreitet.

Wildschweine sind <a href="http://de.wikipedia.org/wiki/Allesfresser" title="Allesfresser">Allesfresser</a> und sehr anpassungsf&auml;hig, in Mitteleuropa nimmt die Population vor allem durch den vermehrten Anbau von Mais derzeit stark zu und wandert verst&auml;rkt in besiedelte Bereiche ein. Das Wildschwein ist die Stammform des <a href="http://de.wikipedia.org/wiki/Hausschwein" title="Hausschwein">Hausschweines</a>.

Wildschweine sind in Europa seit Urzeiten <a class="mw-redirect" href="http://de.wikipedia.org/wiki/Jagdwild" title="Jagdwild">Jagdwild</a>, daher gibt es f&uuml;r Wildschweine unterschiedlichen Alters und beiderlei Geschlechts sowie f&uuml;r viele K&ouml;rperteile Bezeichnungen aus der <a href="http://de.wikipedia.org/wiki/J%C3%A4gersprache" title="Jägersprache">J&auml;gersprache</a>. Im Deutschen allgemein verbreitet sind unter dem Oberbegriff _Schwarzwild_ die jagdlichen Bezeichnungen _Keiler_ f&uuml;r ein m&auml;nnliches und _Bache_ f&uuml;r ein weibliches Wildschwein sowie _Frischling_ f&uuml;r ein Jungtier von bis zu einem Jahr.

*Quiz*

Wildscheine sind

(o) Unpaarhufer
	(q) nur in Europa anzutreffen


Das Wildschwein ist mit dem Hausschwein verwandt.

(i) Wahr
	(h) es dort heimisch ist
	 ',
				'durationInMinutes' => NULL,
				'created_at' => '2014-07-10 11:31:02',
				'updated_at' => '2014-07-10 11:31:02',
			)); 
        
        
        //#################
        //CATEGORY2STATION
        //#################
        
        $category2Station1=Category2Station::create(
			array (
				'stationID' => $station1->id,
				'categoryId' => $category2->id
			)); 
        $category2Station2=Category2Station::create(
			array (
				'stationID' => $station2->id,
				'categoryId' => $category2->id
			));
        $category2Station3=Category2Station::create(
			array (
				'stationID' => $station3->id,
				'categoryId' => $category3->id
			));
        $category2Station4=Category2Station::create(
			array (
				'stationID' => $station4->id,
				'categoryId' => $category2->id
			));
        $category2Station5=Category2Station::create(
			array (
				'stationID' => $station5->id,
				'categoryId' => $category2->id
			));
        $category2Station6=Category2Station::create(
			array (
				'stationID' => $station6->id,
				'categoryId' => $category2->id
			));
        $category2Station7=Category2Station::create(
			array (
				'stationID' => $station7->id,
				'categoryId' => $category2->id
			));
        $category2Station8=Category2Station::create(
			array (
				'stationID' => $station8->id,
				'categoryId' => $category2->id
			));
        $category2Station9=Category2Station::create(
			array (
				'stationID' => $station9->id,
				'categoryId' => $category2->id
			));
        $category2Station10=Category2Station::create(
			array (
				'stationID' => $station10->id,
				'categoryId' => $category2->id
			));
        $category2Station11=Category2Station::create(
			array (
				'stationID' => $station11->id,
				'categoryId' => $category3->id
			));
        $category2Station12=Category2Station::create(
			array (
				'stationID' => $station12->id,
				'categoryId' => $category2->id
			));
        $category2Station13=Category2Station::create(
			array (
				'stationID' => $station13->id,
				'categoryId' => $category2->id
			));
        $category2Station14=Category2Station::create(
			array (
				'stationID' => $station14->id,
				'categoryId' => $category2->id
			));
        $category2Station15=Category2Station::create(
			array (
				'stationID' => $station15->id,
				'categoryId' => $category3->id
			));
        $category2Station16=Category2Station::create(
			array (
				'stationID' => $station16->id,
				'categoryId' => $category2->id
			));
        $category2Station17=Category2Station::create(
			array (
				'stationID' => $station17->id,
				'categoryId' => $category3->id
			));
        $category2Station18=Category2Station::create(
			array (
				'stationID' => $station18->id,
				'categoryId' => $category3->id
			));
        $category2Station19=Category2Station::create(
			array (
				'stationID' => $station19->id,
				'categoryId' => $category1->id
			));
        $category2Station20=Category2Station::create(
			array (
				'stationID' => $station20->id,
				'categoryId' => $category2->id
			));
        $category2Station21=Category2Station::create(
			array (
				'stationID' => $station21->id,
				'categoryId' => $category2->id
			));
        $category2Station22=Category2Station::create(
			array (
				'stationID' => $station22->id,
				'categoryId' => $category1->id
			));
        $category2Station23=Category2Station::create(
			array (
				'stationID' => $station23->id,
				'categoryId' => $category2->id
			));
        $category2Station24=Category2Station::create(
			array (
				'stationID' => $station24->id,
				'categoryId' => $category2->id
			));
        $category2Station25=Category2Station::create(
			array (
				'stationID' => $station25->id,
				'categoryId' => $category2->id
			));
        $category2Station26=Category2Station::create(
			array (
				'stationID' => $station26->id,
				'categoryId' => $category3->id
			));
        $category2Station27=Category2Station::create(
			array (
				'stationID' => $station27->id,
				'categoryId' => $category1->id
			));
        $category2Station28=Category2Station::create(
			array (
				'stationID' => $station28->id,
				'categoryId' => $category4->id
			));
        $category2Station31=Category2Station::create(
			array (
				'stationID' => $station31->id,
				'categoryId' => $category6->id
			));
        $category2Station32=Category2Station::create(
			array (
				'stationID' => $station32->id,
				'categoryId' => $category4->id
			));
        $category2Station36=Category2Station::create(
			array (
				'stationID' => $station36->id,
				'categoryId' => $category5->id
			));
        $category2Station37=Category2Station::create(
			array (
				'stationID' => $station37->id,
				'categoryId' => $category5->id
			));
        
        
        
         //################
        //NAVIGATIONITEM
        //################
        
        $navigationItem0=NavigationItem::create(
            array('mobidulId'=>$mobidul2->id, 
                  'isDivider'=>true, 
                  'order'=>0, 
                  'icon'=>'', 
                  'text'=>'Navigation'
                 )
        ); 
                  
        
        $navigationItem1=NavigationItem::create(
            array(
                'mobidulId'=>$mobidul2->id, 
                'hardcoded'=>'map.html', 
                'order'=>1, 
                'icon'=>'icon-map-marker', 
                'text'=>'Karte'
            )
        );
        
        $navigationItem2=NavigationItem::create(
            array('mobidulId'=>$mobidul2->id, 
                  'isDivider'=>true, 
                  'order'=>2, 
                  'icon'=>'', 
                  'text'=>'Kategorien'
                 )
        ); 
        
        $navigationItem2=NavigationItem::create(
            array(
                'mobidulId'=>$mobidul2->id, 
                'categoryId'=>$category4->id, 
                'order'=>3, 
                'icon'=>'icon-leaf', 
                'text'=>'Alle Pflanzen'
            )
        );
         $navigationItem3=NavigationItem::create(
            array(
                'mobidulId'=>$mobidul2->id, 
                'categoryId'=>$category5->id, 
                'order'=>4, 
                'icon'=>'icon-bullhorn', 
                'text'=>'Alle Tiere'
            )
        );
         $navigationItem4=NavigationItem::create(
            array(
                'mobidulId'=>$mobidul2->id, 
                'categoryId'=>$category6->id, 
                'order'=>5, 
                'icon'=>'icon-dashboard', 
                'text'=>'Alle Stationen'
            )
        );
        
        
        $navigationItem0=NavigationItem::create(
            array('mobidulId'=>$mobidul1->id, 
                  'isDivider'=>true, 
                  'order'=>0, 
                  'icon'=>'', 
                  'text'=>'Stadt'
                 )
        ); 
        
         $navigationItem5=NavigationItem::create(
            array(
                'mobidulId'=>$mobidul1->id, 
                'hardcoded'=>'map.html',  
                'order'=>1, 
                'icon'=>'icon-map-marker', 
                'text'=>'Stadtplan'
            )
        );
        
        $navigationItem0=NavigationItem::create(
            array('mobidulId'=>$mobidul1->id, 
                  'isDivider'=>true, 
                  'order'=>2, 
                  'icon'=>'', 
                  'text'=>'A bis Z '
                 )
        ); 
        $navigationItem6=NavigationItem::create(
            array(
                'mobidulId'=>$mobidul1->id, 
                'categoryId'=>$category1->id, 
                'order'=>3, 
                'icon'=>'icon-group', 
                'text'=>'Öffentlich'
            )
        );
        $navigationItem7=NavigationItem::create(
            array(
                'mobidulId'=>$mobidul1->id, 
                'categoryId'=>$category2->id, 
                'order'=>4, 
                'icon'=>'icon-briefcase', 
                'text'=>'Wirtschaft'
            )
        );
        
        $navigationItem8=NavigationItem::create(
            array(
                'mobidulId'=>$mobidul1->id, 
                'categoryId'=>$category1->id, 
                'order'=>5, 
                'icon'=>'icon-camera', 
                'text'=>'Tourismus'
            )
        );
        
        $navigationItem0=NavigationItem::create(
            array('mobidulId'=>$mobidul1->id, 
                  'isDivider'=>true, 
                  'order'=>6, 
                  'icon'=>'', 
                  'text'=>'Information'
                 )
        ); 
        
        $navigationItem9=NavigationItem::create(
            array(
                'mobidulId'=>$mobidul1->id, 
                'stationId'=>$station19->id, 
                'order'=>7, 
                'icon'=>'icon-home', 
                'text'=>'Stadt Pressbaum'
            )
        );
        
    }
}