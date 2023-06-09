import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const seed = async () => {
  const songs = [
    { title:   "(Sittin' on) The Dock of the Bay" },
    { title:   "1 x 1" },
    { title:   "A Hard Rain's A-Gonna Fall" },
    { title:   "A Little Help from My Friends" },
    { title:   "A of D" },
    { title:   "Ace of Spades" },
    { title:   "Action Man" },
    { title:   "After Midnight" },
    { title:   "Ain't Life Grand" },
    { title:   "Ain't No Sunshine" },
    { title:   "Airplane" },
    { title:   "All Along the Watchtower" },
    { title:   "All Time Low" },
    { title:   "Already Fried" },
    { title:   "Analyze" },
    { title:   "And It Stoned Me" },
    { title:   "Angels Don't Sing the Blues" },
    { title:   "Angels on High" },
    { title:   "Another Man Done Gone" },
    { title:   "Are You Ready for the Country?" },
    { title:   "Arleen" },
    { title:   "Astronomy Domine" },
    { title:   "Aunt Avis" },
    { title:   "B of D" },
    { title:   "Baby, Let Me Follow You Down" },
    { title:   "Baby, Let Me Hold Your Hand" },
    { title:   "Baby, Please Don't Go" },
    { title:   "Ball of Confusion" },
    { title:   "The Ballad of John and Yoko" },
    { title:   "Barstools and Dreamers" },
    { title:   "Basically Frightened" },
    { title:   "Bastards in Bubbles" },
    { title:   "Bayou Lena" },
    { title:   "Bear's Gone Fishin'" },
    { title:   "Beat on the Brat" },
    { title:   "Benefactor" },
    { title:   "Better Off" },
    { title:   "Big Wooly Mammoth" },
    { title:   "Bird Song" },
    { title:   "Black Sabbath" },
    { title:   "Blackout Blues" },
    { title:   "Blight" },
    { title:   "Blue Indian" },
    { title:   "Blue Sunday" },
    { title:   "Boom Boom Boom" },
    { title:   "Bowlegged Woman" },
    { title:   "Boys in the Barroom" },
    { title:   "Breathing Slow" },
    { title:   "Brown Eyed Girl" },
    { title:   "Burning Down the House" },
    { title:   "Bust It Big" },
    { title:   "C. Brown" },
    { title:   "Can't Find My Way Home" },
    { title:   "Can't Get High" },
    { title:   "Cardboard Box" },
    { title:   "Carmelita" },
    { title:   "Casa Del Grillo" },
    { title:   "Cease Fire" },
    { title:   "The Chain" },
    { title:   "Chainsaw City" },
    { title:   "Chest Fever" },
    { title:   "Children of the Grave" },
    { title:   "Chilly Water" },
    { title:   "China Cat Sunflower" },
    { title:   "Christmas Katie" },
    { title:   "Chunk of Coal" },
    { title:   "Cissy Strut" },
    { title:   "City of Dreams" },
    { title:   "Cleburne Terrace" },
    { title:   "Climb to Safety" },
    { title:   "Clinic Cynic" },
    { title:   "Coach" },
    { title:   "Cocaine" },
    { title:   "Coconut" },
    { title:   "Come Together" },
    { title:   "Conrad" },
    { title:   "Contentment Blues" },
    { title:   "Cortez the Killer" },
    { title:   "Cotton Was King" },
    { title:   "Counting Train Cars" },
    { title:   "Crazy" },
    { title:   "Cream Puff War" },
    { title:   "Crippled Inside" },
    { title:   "Cross Cut Saw" },
    { title:   "Crossroads" },
    { title:   "Cryptical Envelopment" },
    { title:   "Daisy Mae" },
    { title:   "Dark Bar" },
    { title:   "Dark Day Program" },
    { title:   "Dark End of the Street" },
    { title:   "Dear Mr. Fantasy" },
    { title:   "Dear Prudence" },
    { title:   "Degenerate" },
    { title:   "Devil in Disguise" },
    { title:   "Diner" },
    { title:   "Dirty Business" },
    { title:   "Dirty Side Down" },
    { title:   "Disco" },
    { title:   "Do What You Like" },
    { title:   "Dog Song" },
    { title:   "Don't Be Denied" },
    { title:   "Don't Tell the Band" },
    { title:   "Don't Wanna Lose You" },
    { title:   "Doreatha" },
    { title:   "Down" },
    { title:   "Down on the Farm" },
    { title:   "Dream Song" },
    { title:   "Drinking Muddy Water" },
    { title:   "Drive" },
    { title:   "Driving Song" },
    { title:   "D'yer Maker" },
    { title:   "Dyin' Man" },
    { title:   "E on a G" },
    { title:   "The Earth Will Swallow You" },
    { title:   "Easy Wind" },
    { title:   "End of the Show" },
    { title:   "Entering a Black Hole Backwards" },
    { title:   "Expiration Day" },
    { title:   "Fairies Wear Boots" },
    { title:   "Familiar Reality" },
    { title:   "Feelin' Alright" },
    { title:   "Fire on the Mountain" },
    { title:   "Fishing" },
    { title:   "Fishwater" },
    { title:   "Fixin' to Die" },
    { title:   "Flat Foot Flewzy" },
    { title:   "Flicker" },
    { title:   "For What It's Worth" },
    { title:   "Four Cornered Room" },
    { title:   "Foxy Lady" },
    { title:   "Free Somehow" },
    { title:   "From the Cradle" },
    { title:   "Galleon" },
    { title:   "Genesis" },
    { title:   "Georgia on a Fast Train" },
    { title:   "Georgia on My Mind" },
    { title:   "Geraldine and the Honeybee" },
    { title:   "Get in Get Out" },
    { title:   "Get Up (I Feel Like Being a Sex Machine)" },
    { title:   "Get Up Early in the Morning" },
    { title:   "Gimme" },
    { title:   "Give" },
    { title:   "Glad" },
    { title:   "Glory" },
    { title:   "God Was in the Water" },
    { title:   "Godzilla" },
    { title:   "Goin' Out West" },
    { title:   "Good Morning Little Schoolgirl" },
    { title:   "Goodpeople" },
    { title:   "Gradle" },
    { title:   "Green Onions" },
    { title:   "Greta" },
    { title:   "Hallelujah" },
    { title:   "Halloween Face" },
    { title:   "Happy" },
    { title:   "Happy Child" },
    { title:   "The Harder They Come" },
    { title:   "Havin' a Ball" },
    { title:   "Heart of Gold" },
    { title:   "Hearts Gone Blind" },
    { title:   "Heathen" },
    { title:   "Heaven" },
    { title:   "Help Me" },
    { title:   "Help Me Somebody" },
    { title:   "Henry Parsons Died" },
    { title:   "Her Dance Needs No Body" },
    { title:   "Heroes" },
    { title:   "Heroes (DB)" },
    { title:   "High Time We Went" },
    { title:   "Holden Oversoul" },
    { title:   "Honey Bee" },
    { title:   "Honky Red" },
    { title:   "Hope in a Hopeless World" },
    { title:   "House of the Rising Sun" },
    { title:   "I Can See Clearly Now" },
    { title:   "I Know You Rider" },
    { title:   "I Like the Things About Me" },
    { title:   "I Put a Spell on You" },
    { title:   "I Told Her I'd Be Early" },
    { title:   "I Trusted You" },
    { title:   "I Walk on Guilded Splinters" },
    { title:   "I Wanna Be Sedated" },
    { title:   "I Want You (She's So Heavy)" },
    { title:   "I Wish" },
    { title:   "I Wish You Would" },
    { title:   "If You'se a Viper" },
    { title:   "Iko Iko" },
    { title:   "I'm Not Alone" },
    { title:   "I'm So Glad" },
    { title:   "Imitation Leather Shoes" },
    { title:   "Impossible" },
    { title:   "Interstellar Overdrive" },
    { title:   "Iron Man" },
    { title:   "It Ain't No Use" },
    { title:   "It Was You" },
    { title:   "It's All Over Now" },
    { title:   "I've Been Working" },
    { title:   "Jack" },
    { title:   "Jaded Tourist" },
    { title:   "Jamais Vu" },
    { title:   "Jessica" },
    { title:   "Jesus Just Left Chicago" },
    { title:   "Journey Through the Past" },
    { title:   "Junco Partner" },
    { title:   "Junior" },
    { title:   "Just Kissed My Baby" },
    { title:   "Just Like a Woman" },
    { title:   "Keep Your Lamps Trimmed and Burning" },
    { title:   "Key to the Highway" },
    { title:   "Knockin' on Heaven's Door" },
    { title:   "Knocking 'Round the Zoo" },
    { title:   "L.a." },
    { title:   "L.A. Woman" },
    { title:   "Lake of Fire" },
    { title:   "Last Dance" },
    { title:   "The Last Straw" },
    { title:   "Lawyers, Guns, and Money" },
    { title:   "Lean on Me" },
    { title:   "Let It Bleed" },
    { title:   "Let It Rock" },
    { title:   "Let's Get Down to Business" },
    { title:   "Let's Get the Show on the Road" },
    { title:   "Life During Wartime" },
    { title:   "Light Is Like Water" },
    { title:   "Little Kin" },
    { title:   "Little Lilly" },
    { title:   "Little Wing" },
    { title:   "Long Cool Woman in a Black Dress" },
    { title:   "Long May You Live" },
    { title:   "Love and Happiness" },
    { title:   "Love the One You're With" },
    { title:   "Love Tractor" },
    { title:   "Low Rider" },
    { title:   "Low Spark of High Heeled Boys" },
    { title:   "Machine" },
    { title:   "Machine Gun" },
    { title:   "Maggot Brain" },
    { title:   "Makes Sense to Me" },
    { title:   "Mama Told Me Not to Come" },
    { title:   "Man Smart, Woman Smarter" },
    { title:   "Many Rivers to Cross" },
    { title:   "Mardi Gras in New Orleans" },
    { title:   "May Your Glass Be Filled" },
    { title:   "Me and My Uncle" },
    { title:   "Me and the Devil Blues" },
    { title:   "Meeting of the Waters" },
    { title:   "Mercy" },
    { title:   "Mercy Train to Bogart" },
    { title:   "Monstrosity" },
    { title:   "Moondance" },
    { title:   "Morally Challenged" },
    { title:   "Morning Dew" },
    { title:   "Mountain Hideaway" },
    { title:   "Mountain Jam" },
    { title:   "Mr. Soul" },
    { title:   "Nebulous" },
    { title:   "New Blue" },
    { title:   "New Minglewood Blues" },
    { title:   "New Speedway Boogie" },
    { title:   "Nights in White Satin" },
    { title:   "No Sugar Tonight/New Mother Nature" },
    { title:   "Nobody's Fault but Mine" },
    { title:   "Nobody's Loss" },
    { title:   "None of Us Are Free" },
    { title:   "North" },
    { title:   "Not Fade Away" },
    { title:   "Old Joe" },
    { title:   "Old Neighborhood" },
    { title:   "On Your Way Down" },
    { title:   "One Arm Steve" },
    { title:   "One Kind Favor" },
    { title:   "Ophelia" },
    { title:   "Orange Blossom Special" },
    { title:   "The Other One" },
    { title:   "Over the Hills and Far Away" },
    { title:   "Papa Johnny Road" },
    { title:   "Papa Legba" },
    { title:   "Papa's Home" },
    { title:   "Paranoid" },
    { title:   "Party at Your Mama's House" },
    { title:   "Peace Frog" },
    { title:   "Pickin' Up the Pieces" },
    { title:   "Pigeons" },
    { title:   "Pilgrims" },
    { title:   "Pleas" },
    { title:   "The Poorhouse of Positive Thinking" },
    { title:   "Porch Song" },
    { title:   "Postcard" },
    { title:   "Protein Drink" },
    { title:   "Proving Ground" },
    { title:   "Puppy Sleeps" },
    { title:   "Pusherman" },
    { title:   "Quarter Tank of Gasoline" },
    { title:   "Radar Love" },
    { title:   "Radio Child" },
    { title:   "Rainy Day Women #12 & 35" },
    { title:   "Raise the Roof" },
    { title:   "Rebirtha" },
    { title:   "Red Beans" },
    { title:   "Red Hot Mama" },
    { title:   "Ribs and Whiskey" },
    { title:   "Ride Me High" },
    { title:   "Riders on the Storm" },
    { title:   "Road to Damascus" },
    { title:   "Rock" },
    { title:   "Rockin' in the Free World" },
    { title:   "Rumble" },
    { title:   "Run for Your Life" },
    { title:   "Saint Ex" },
    { title:   "Sandbox" },
    { title:   "Scarlet Begonias" },
    { title:   "Scholarship" },
    { title:   "Second Skin" },
    { title:   "Sell Sell" },
    { title:   "Send Your Mind" },
    { title:   "Sewing Machine" },
    { title:   "Shake, Rattle, and Roll" },
    { title:   "The Shape I'm In" },
    { title:   "Sharon" },
    { title:   "She Caught the Katy" },
    { title:   "Shiek" },
    { title:   "Shoes on Tight" },
    { title:   "Shoot Out at the Fantasy Factory" },
    { title:   "Shouldn't Have Took More Than You Gave" },
    { title:   "Shut Up and Drive" },
    { title:   "Sitting in Limbo" },
    { title:   "Skin It Back" },
    { title:   "Sleeping Man" },
    { title:   "Sleepy Monkey" },
    { title:   "Slippin' into Darkness" },
    { title:   "Smoke and Burn" },
    { title:   "Smokestack Lightning" },
    { title:   "Smoking Factory" },
    { title:   "Snake Drive" },
    { title:   "Solace" },
    { title:   "Solid Rock" },
    { title:   "Sometimes" },
    { title:   "Somewhere in Time" },
    { title:   "Song for Sitara" },
    { title:   "Soul Kitchen" },
    { title:   "Space Wrangler" },
    { title:   "Sparks Fly" },
    { title:   "Spill the Wine" },
    { title:   "Spoonful" },
    { title:   "St. Louis" },
    { title:   "Stag-O-Lee" },
    { title:   "Steven's Cat" },
    { title:   "Stir It Up" },
    { title:   "Stop Breakin' Down Blues" },
    { title:   "Stop-Go" },
    { title:   "Straight to Hell" },
    { title:   "Strange Times" },
    { title:   "Stranger in a Strange Land" },
    { title:   "Street Dogs for Breakfast" },
    { title:   "Success Yourself" },
    { title:   "Sugaree" },
    { title:   "Sultans of Swing" },
    { title:   "Sundown Betty" },
    { title:   "Superstition" },
    { title:   "Surprise Valley" },
    { title:   "Susie Q" },
    { title:   "Swamp" },
    { title:   "Sweet Leaf" },
    { title:   "Sympathy for the Devil" },
    { title:   "Tacos" },
    { title:   "Tail Dragger" },
    { title:   "The Take Out" },
    { title:   "Tall Boy" },
    { title:   "Tears of a Woman" },
    { title:   "Testify" },
    { title:   "Thank You Falettinme Be Mice Elf Agin" },
    { title:   "That Don't Make It Junk" },
    { title:   "That's All Right Mama" },
    { title:   "That's What Love Will Make You Do" },
    { title:   "There Is a Time" },
    { title:   "There's a Hole in the Bucket" },
    { title:   "Thin Air (Smells Like Mississippi)" },
    { title:   "This Cruel Thing" },
    { title:   "This Friendly World" },
    { title:   "This Masquerade" },
    { title:   "This Part of Town" },
    { title:   "Thought Sausage" },
    { title:   "Three Candles" },
    { title:   "Tickle the Truth" },
    { title:   "Tie Your Shoes" },
    { title:   "Time Fades Away" },
    { title:   "Time Is Free" },
    { title:   "Time Waits" },
    { title:   "Time Waits for No One" },
    { title:   "Time Zones" },
    { title:   "Tipitina" },
    { title:   "Tonight's the Night" },
    { title:   "Tortured Artist" },
    { title:   "Trashy" },
    { title:   "Travelin' Light" },
    { title:   "Travelin' Man" },
    { title:   "Trondossa" },
    { title:   "Trouble" },
    { title:   "True to My Nature" },
    { title:   "Turn on Your Love Light" },
    { title:   "Up All Night" },
    { title:   "Use Me" },
    { title:   "Vacation" },
    { title:   "Vampire Blues" },
    { title:   "Vicious" },
    { title:   "Visiting Day" },
    { title:   "Wait for No One" },
    { title:   "Waitin' for the Bus" },
    { title:   "The Waker" },
    { title:   "Walk On" },
    { title:   "Walk on the Flood" },
    { title:   "Walkin' (for Your Love)" },
    { title:   "Wang Dang Doodle" },
    { title:   "Weak Brain, Narrow Mind" },
    { title:   "Weight of the World" },
    { title:   "We'll Be Fine" },
    { title:   "Werewolves of London" },
    { title:   "West Virginia" },
    { title:   "Wet Trombone Blues" },
    { title:   "When the Clowns Come Home" },
    { title:   "When You Coming Home" },
    { title:   "Who Do You Belong To?" },
    { title:   "Why Don't We Do It in the Road?" },
    { title:   "Wild Thing" },
    { title:   "The Wind Cries Mary" },
    { title:   "Wish You Were Here" },
    { title:   "Wishbone" },
    { title:   "Wondering" },
    { title:   "Wooden Ships" },
    { title:   "Worry" },
    { title:   "Yard of Blonde Girls" },
    { title:   "You Better Run" },
    { title:   "You Can't Always Get What You Want" },
    { title:   "You Got Yours" },
    { title:   "You Gotta Move" },
    { title:   "You Should Be Glad" },
    { title:   "You Wreck Me" },
    { title:   "You'll Be Fine" },
    { title:   "You've Got to Hide Your Love Away" },
    { title:   "Zigzaggin' Through Ghostland" }
  ]

  for (let i = 0; i < songs.length; i++) {
    const s = songs[i]
    await db.song.create({
      data: s
    })
  }

  const venue = await db.venue.create({
    data: {
      name: 'The Riverside Theater',
      city: 'Milwaukee',
      state: 'WI'
    }
  })

  await db.show.create({
    data: {
      date: new Date('2022-10-22T01:00:00Z'),
      venueId: venue.id,
      contest: {
        create: {}
      }
    }
  })

  await db.show.create({
    data: {
      date: new Date('2022-10-23T01:00:00Z'),
      venueId: venue.id,
      contest: {
        create: {}
      }
    }
  })

  await db.show.create({
    data: {
      date: new Date('2022-10-24T01:00:00Z'),
      venueId: venue.id,
      contest: {
        create: {}
      }
    }
  })

  await db.user.create({
    data: {
      username: 'abl',
      passwordHash: '$2a$10$svRs0b4SXmJ0gJCSduaNvOJi/22r8lUVg6VCLrLk3IT/9JmtjfyiG',
      email: 'adam.land@gmail.com',
      isAdmin: true
    }
  })
}

seed()
