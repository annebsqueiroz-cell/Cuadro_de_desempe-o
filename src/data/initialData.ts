import { Student, Turma, StickerRecord } from '../types';
import stickersBackup from './stickersBackup.json';

export const INITIAL_TURMAS: Turma[] = [
  {
    id: 'turma-1',
    name: '2* Nivel - Djalma - Sábado',
    starEmoji: '🐾',
    schoolName: 'Rincón Hispano',
    teacherName: 'Maestra Anne',
    monthlyGoal: 9,
    monthlyRewardDescription: 'Certificado de Destaque + Kit com Lápis de Cor e Adesivos Especiais',
  },
  {
    id: 'turma-1790124077430',
    name: '1* Nivel Martes Djalma',
    starEmoji: '👑',
    schoolName: 'Rincón Hispano',
    teacherName: 'Maestra Anne',
    monthlyGoal: 8,
    monthlyRewardDescription: 'Certificado de Honor + Obsequio Rincón Hispano',
    ownerId: 'user-aqueiroz',
  },
  {
    id: 'turma-1790426865228',
    name: '5 Nivel - Djalma- 8 hrs',
    starEmoji: '💎',
    schoolName: 'Rincón Hispano',
    teacherName: 'Maestra Anne',
    monthlyGoal: 8,
    monthlyRewardDescription: 'Certificado de Honor + Obsequio Rincón Hispano',
    ownerId: 'user-aqueiroz',
  },
  {
    id: 'turma-2',
    name: '2* Nivel - Alvorada',
    starEmoji: '🦉',
    schoolName: 'Rincón Hispano',
    teacherName: 'Maestra Anne',
    monthlyGoal: 10,
    monthlyRewardDescription: 'Certificado de Reconhecimento + 1 Ponto Extra na Próxima Avaliação',
  },
];

export const INITIAL_STUDENTS: Student[] = [
  // 2* Nivel - Djalma - Sábado (turma-1)
  { id: 'std-1789833839924-pumh', active: true, name: 'KETLEN VITORIA SOUZA GONZAGA', avatarColor: 'bg-rose-100 text-rose-700 border-rose-200', turmaId: 'turma-1' },
  { id: 'std-1789833856083-jb8m', active: true, name: 'EMILLY YOHANNA VIANA DE ANDRADE REBOUCAS', avatarColor: 'bg-sky-100 text-sky-700 border-sky-200', turmaId: 'turma-1' },
  { id: 'std-1789833922851-seky', active: true, name: 'MARCOS DAVI DE OLIVEIRA LIMA', avatarColor: 'bg-orange-100 text-orange-700 border-orange-200', turmaId: 'turma-1' },
  { id: 'std-1789834000170-tljq', active: true, name: 'JULLYANE DE SOUZA DOS SANTOS', avatarColor: 'bg-orange-100 text-orange-700 border-orange-200', turmaId: 'turma-1' },
  { id: 'std-1789834344696-et8t', active: true, name: 'LYANDRA LOHANNA DE MATOS GARCIA', avatarColor: 'bg-teal-100 text-teal-700 border-teal-200', turmaId: 'turma-1' },
  { id: 'std-1789834619303-jf4l', active: true, name: 'MEYCK BRENOL GATTO PAZ', avatarColor: 'bg-sky-100 text-sky-700 border-sky-200', turmaId: 'turma-1' },
  { id: 'std-1789835009237-a1je', active: true, name: 'BRUNO DIAS BEZERRA JÚNIOR', avatarColor: 'bg-orange-100 text-orange-700 border-orange-200', turmaId: 'turma-1' },
  { id: 'std-1789837523758-hzph', active: true, name: 'MARCIO BORBA SALDANHA', avatarColor: 'bg-rose-100 text-rose-700 border-rose-200', turmaId: 'turma-1' },
  { id: 'std-1790438965532-ga1x', active: true, name: 'RAYKA CÉLIA SILVA DE LIMA', avatarColor: 'bg-purple-100 text-purple-700 border-purple-200', turmaId: 'turma-1' },
  { id: 'std-1790439282364-jfk7', active: true, name: 'MARIANY DE ANDRADE PACHECO', avatarColor: 'bg-sky-100 text-sky-700 border-sky-200', turmaId: 'turma-1' },
  { id: 'std-1790440275394-5g6m', active: true, name: 'MARIA KARINE RIBEIRO BARRETO', avatarColor: 'bg-rose-100 text-rose-700 border-rose-200', turmaId: 'turma-1' },

  // 1* Nivel Martes Djalma (turma-1790124077430)
  { id: 'std-1790124141930-q1ce', active: true, name: 'ANDREIA DE SEIXAS MIRANDA', avatarColor: 'bg-rose-100 text-rose-700 border-rose-200', turmaId: 'turma-1790124077430' },
  { id: 'std-1790124194119-7w0v', active: true, name: 'ANTÔNIA GEOVANNA TAVARES FERREIRA', avatarColor: 'bg-rose-100 text-rose-700 border-rose-200', turmaId: 'turma-1790124077430' },
  { id: 'std-1790124288142-7cqz', active: true, name: 'CAMILA LOPES DA SILVA', avatarColor: 'bg-sky-100 text-sky-700 border-sky-200', turmaId: 'turma-1790124077430' },
  { id: 'std-1790124352606-wq0h', active: true, name: 'JAILA MANUELA COSTA SILVA', avatarColor: 'bg-indigo-100 text-indigo-700 border-indigo-200', turmaId: 'turma-1790124077430' },
  { id: 'std-1790124395085-2jcr', active: true, name: 'MAURO LIVIO SERRAO RIBEIRO', avatarColor: 'bg-purple-100 text-purple-700 border-purple-200', turmaId: 'turma-1790124077430' },
  { id: 'std-1790124424469-nf6r', active: true, name: 'THAYNÁ DE BRITO MOTA', avatarColor: 'bg-indigo-100 text-indigo-700 border-indigo-200', turmaId: 'turma-1790124077430' },
  { id: 'std-1790124473980-v9gc', active: true, name: 'LUNA EMILY ZOIM LEMOS', avatarColor: 'bg-rose-100 text-rose-700 border-rose-200', turmaId: 'turma-1790124077430' },
  { id: 'std-1790720006128-8i3x', active: true, name: 'MARIA FERNANDA NASCIMENTO GOMES', avatarColor: 'bg-orange-100 text-orange-700 border-orange-200', turmaId: 'turma-1790124077430' },

  // 5 Nivel - Djalma- 8 hrs (turma-1790426865228)
  { id: 'std-1790426924614-vr26', active: true, name: 'ALEXSANDRO VIEIRA SANTANA FILHO', avatarColor: 'bg-indigo-100 text-indigo-700 border-indigo-200', turmaId: 'turma-1790426865228' },
  { id: 'std-1790427003948-dp9j', active: true, name: 'CARLA DANIELA DE CASTRO VARJAO', avatarColor: 'bg-indigo-100 text-indigo-700 border-indigo-200', turmaId: 'turma-1790426865228' },
  { id: 'std-1790427094588-yui0', active: true, name: 'ELOÍSA GOMES LIMA DE SALES', avatarColor: 'bg-indigo-100 text-indigo-700 border-indigo-200', turmaId: 'turma-1790426865228' },
  { id: 'std-1790427127151-8iom', active: true, name: 'MARIA DO SOCORRO RODRIGUES FERREIRA GONZAGA', avatarColor: 'bg-sky-100 text-sky-700 border-sky-200', turmaId: 'turma-1790426865228' },
  { id: 'std-1790427163948-a9ya', active: true, name: 'PRISCILA PAOLA SILVA DOS SANTOS', avatarColor: 'bg-emerald-100 text-emerald-700 border-emerald-200', turmaId: 'turma-1790426865228' },
  { id: 'std-1790427191427-tpnp', active: true, name: 'SONIA MARIA SARKIS DE SOUZA', avatarColor: 'bg-sky-100 text-sky-700 border-sky-200', turmaId: 'turma-1790426865228' },
  { id: 'std-1790427217444-l5gu', active: true, name: 'TEREZA MAGNOLIA GARCIA MARQUES QUEIRÓZ', avatarColor: 'bg-emerald-100 text-emerald-700 border-emerald-200', turmaId: 'turma-1790426865228' },

  // 2* Nivel - Alvorada (turma-2)
  { id: 'std-1789844888814-a5t8', active: true, name: 'JOSE AIRTON VEIGA DOS SANTOS', avatarColor: 'bg-rose-100 text-rose-700 border-rose-200', turmaId: 'turma-2' },
  { id: 'std-1789844957237-k4e3', active: true, name: 'LORENA DE OLIVEIRA SAMPAIO', avatarColor: 'bg-emerald-100 text-emerald-700 border-emerald-200', turmaId: 'turma-2' },
  { id: 'std-1789845088123-zg4m', active: true, name: 'FILIPE DA COSTA SILVA', avatarColor: 'bg-indigo-100 text-indigo-700 border-indigo-200', turmaId: 'turma-2' },
  { id: 'std-1789845213531-y382', active: true, name: 'VINICIUS DE OLIVEIRA DO NASCIMENTO', avatarColor: 'bg-orange-100 text-orange-700 border-orange-200', turmaId: 'turma-2' },
  { id: 'std-1789845256379-fnrk', active: true, name: 'NIZAR HAUACHE BICHARA', avatarColor: 'bg-sky-100 text-sky-700 border-sky-200', turmaId: 'turma-2' },
  { id: 'std-1789845296747-7qas', active: true, name: 'JHUAN PABLO GAMA LIMA', avatarColor: 'bg-orange-100 text-orange-700 border-orange-200', turmaId: 'turma-2' },
  { id: 'std-1789846214711-427w', active: true, name: 'MARIA FERNANDA FERREIRA DOS SANTOS', avatarColor: 'bg-sky-100 text-sky-700 border-sky-200', turmaId: 'turma-2' },
  { id: 'std-1789847893309-ahvl', active: true, name: 'LILIANY VIANA DE OLIVEIRA', avatarColor: 'bg-orange-100 text-orange-700 border-orange-200', turmaId: 'turma-2' },
  { id: 'std-1789847914916-jlk0', active: true, name: 'MAYARA SANTOS DE CASTRO', avatarColor: 'bg-amber-100 text-amber-700 border-amber-200', turmaId: 'turma-2' },
  { id: 'std-1790202527446-bxdv', active: true, name: 'ISABELLA JARDIM PEDROZA', avatarColor: 'bg-teal-100 text-teal-700 border-teal-200', turmaId: 'turma-2' },
  { id: 'std-1790203333010-7pq1', active: true, name: 'ENZO NOGUEIRA MAZAMBONI DOS REIS', avatarColor: 'bg-orange-100 text-orange-700 border-orange-200', turmaId: 'turma-2' },
  { id: 'std-1790203350938-ys0h', active: true, name: 'GABRIELA NOGUEIRA DE OLIVEIRA', avatarColor: 'bg-purple-100 text-purple-700 border-purple-200', turmaId: 'turma-2' },
  { id: 'std-1790450393821-syzt', active: true, name: 'ROYCE RUDÁ MENDONÇA ARAÚJO', avatarColor: 'bg-emerald-100 text-emerald-700 border-emerald-200', turmaId: 'turma-2' },
  { id: 'std-1790455728986-kmtz', active: true, name: 'REBECA DE SOUZA RODRIGUES', avatarColor: 'bg-indigo-100 text-indigo-700 border-indigo-200', turmaId: 'turma-2' },
  { id: 'std-1790807819119-s7n7', active: true, name: 'ANDRYA CAMILLE LEÃO DAMASCENO', avatarColor: 'bg-amber-100 text-amber-700 border-amber-200', turmaId: 'turma-2' },
];

export function getInitialStickers(): StickerRecord[] {
  return (stickersBackup as StickerRecord[]);
}
