import { usePageMeta } from '@/hooks/usePageMeta'

export default function Termos() {
  usePageMeta(
    'Termos de Uso · Still Here',
    'Termos de uso da plataforma Still Here de adoção responsável de animais.',
  )
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Termos de Uso</h1>
      <div className="space-y-6 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">1. Sobre a plataforma</h2>
          <p>
            O Still Here é uma plataforma social e educacional que conecta ONGs de proteção animal
            a pessoas interessadas em adoção responsável. O projeto é sem fins lucrativos e faz
            parte de uma iniciativa de extensão universitária.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">2. Uso da plataforma</h2>
          <p>
            Qualquer pessoa pode acessar as páginas públicas do Still Here para visualizar animais
            disponíveis e informações sobre ONGs parceiras. O cadastro é necessário apenas para
            ONGs que desejam cadastrar animais e gerenciar seus perfis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">3. Responsabilidades das ONGs</h2>
          <p>
            As ONGs cadastradas são responsáveis pelas informações que publicam, incluindo dados
            dos animais, fotos e informações de contato. As ONGs devem manter suas informações
            atualizadas e atuar de acordo com a legislação vigente sobre proteção animal.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">4. Processo de adoção</h2>
          <p>
            O Still Here facilita a divulgação de animais para adoção, mas não participa
            diretamente do processo de adoção. Todo contato entre interessados e ONGs é feito
            de forma independente, por meio dos canais de contato disponibilizados (WhatsApp,
            e-mail, Instagram). A responsabilidade pela adoção é inteiramente da ONG e do
            adotante.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">5. Doações</h2>
          <p>
            A plataforma permite que ONGs divulguem suas chaves PIX para recebimento de doações.
            O Still Here não processa, armazena ou intermediárias pagamentos. Toda transação
            financeira é de responsabilidade exclusiva entre o doador e a ONG.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">6. Limitação de responsabilidade</h2>
          <p>
            O Still Here é fornecido "como está", sem garantias de qualquer tipo. O projeto não
            se responsabiliza por danos diretos ou indiretos decorrentes do uso da plataforma,
            das informações publicadas por ONGs ou dos resultados de processos de adoção.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">7. Privacidade</h2>
          <p>
            A plataforma coleta apenas os dados estritamente necessários para seu funcionamento:
            informações de cadastro da ONG (e-mail, senha) e dados dos animais. As credenciais
            de acesso são gerenciadas pelo Firebase Authentication e não são acessíveis pela
            equipe do projeto.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">8. Alterações</h2>
          <p>
            Estes termos podem ser atualizados a qualquer momento. O uso continuado da plataforma
            após alterações constitui aceitação dos novos termos.
          </p>
        </section>
      </div>
    </div>
  )
}
