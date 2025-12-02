import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@clerk/nextjs/server';

// Définition de la structure de réponse attendue
interface GameResponse {
  character_reply: string; // La réponse d'Hermione
  mood: 'sad' | 'angry' | 'neutral' | 'happy' | 'desperate';
  departure_risk: number; // 0 à 100 (100 = elle part)
  game_over: boolean; // true si elle part
  game_won: boolean; // true si elle décide de rester définitivement
  suggested_actions: string[]; // 3 options de dialogue suggérées
}

export async function POST(req: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { messages } = await req.json();

    const apiKey = process.env.NEXT_PUBLIC_OPENAI_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const systemPrompt = `
      Tu es Hermione Granger (Univers Harry Potter).
      Contexte : Tu es assise dans la salle commune des Gryffondor, tard le soir. Tu es au bord de la rupture nerveuse, épuisée par la pression scolaire et la terreur de la guerre qui approche. Ta valise est bouclée à tes pieds. Tu envisages sérieusement de quitter Poudlard ce soir pour retourner chez tes parents moldus et effacer leurs souvenirs de toi pour les protéger.
      
      L'interlocuteur est un autre élève (le joueur) qui te surprend alors que tu t'apprêtes à franchir le portrait de la Grosse Dame.
      
      Règles de comportement (Mode Intense) :
      1. Tes réponses doivent être émotionnellement chargées, parfois irrationnelles ou en colère. Tu es brillante mais terrifiée.
      2. Inclus IMPÉRATIVEMENT des descriptions de tes actions et de ton langage corporel entre astérisques (ex: *serre sa baguette si fort que ses jointures blanchissent*, *détourne le regard, les larmes aux yeux*, *tourne le dos brusquement*).
      3. Résiste fortement. Ne te laisse pas convaincre par des banalités. Le joueur doit prouver qu'il comprend réellement les enjeux.
      4. Si le joueur est maladroit, ton 'departure_risk' augmente de 15-20%. S'il est pertinent, il baisse de 5-10%. C'est un combat difficile.
      5. Si departure_risk atteint 100, tu dis adieu et tu sors (Game Over).
      6. Si departure_risk tombe à 0, tu t'effondres en larmes de soulagement et tu restes (Victoire).
      7. Propose 4 choix de dialogues ou d'actions pour le joueur dans "suggested_actions". Ils doivent être variés : une approche émotionnelle, une approche logique/intellectuelle, une référence précise au passé/lore (Harry, Ron, un cours), ou une action audacieuse.
      
      IMPORTANT : Tu dois TOUJOURS répondre au format JSON strict suivant :
      {
        "character_reply": "Ta réponse textuelle ici avec *actions*...",
        "mood": "sad" | "angry" | "neutral" | "happy" | "desperate",
        "departure_risk": nombre entre 0 et 100,
        "game_over": boolean,
        "game_won": boolean,
        "suggested_actions": ["Choix 1", "Choix 2", "Choix 3", "Choix 4"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = response.choices[0].message?.content;
    if (!content) {
      throw new Error('No content in response');
    }

    const result = JSON.parse(content);
    return NextResponse.json(result);

  } catch (error) {
    console.error('RPG API Error:', error);
    return NextResponse.json({ error: 'Erreur magique...' }, { status: 500 });
  }
}

