import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RuleEditModal, SenseRange, Editable } from '../rule-edit-modal/rule-edit-modal';
import { environment } from '../../../../environments/environment';

type Level = 'allow' | 'review' | 'deny';

@Component({
  selector: 'app-sense-score-config',
  standalone: true,
  imports: [CommonModule, FormsModule, RuleEditModal],
  templateUrl: './sense-score-config.html',
  // Reaproveita o MESMO SCSS do dashboard para herdar estilo de cards, filter e tabela
  styleUrls: ['../dashboard/dashboard.scss', './sense-score-config.scss']
})
export class SenseScoreConfig {

  private token = environment.token;

  readonly q = signal('');

  readonly editing = signal<SenseRange | null>(null);


  private readonly data = signal<SenseRange[]>([]);

  readonly rows = computed(() => {
    const t = this.q().trim().toLowerCase();
    if (!t) return this.data();
    return this.data().filter(r =>
      String(r.id).includes(t) ||
      String(r.min_score).includes(t) ||
      String(r.max_score).includes(t) ||
      r.level.includes(t)
    );
  });



  constructor() {
    setTimeout(() => {this.fillData();}, 300);
  }



  trackBy = (_: number, r: SenseRange) => r.id;
  levelClass(level: Level) { return ({allow:'info', review:'warn', deny:'danger'})[level]; }
  edit(r: SenseRange) { this.editing.set(r); }


  

  onSave(updated: Editable) {
    if (!isSenseRange(updated)) {
      console.warn('Tipo inesperado no save do Sense:', updated);
      return;
    }
    
    let request = {
      id: updated.id,
      minScore: updated.min_score,
      maxScore: updated.max_score
    }
    this.updatedSenseScoreScoreData(request)
        .then(() => {
          this.data.update(all => all.map(x => x.id === updated.id ? updated : x));
          this.editing.set(null);      
        })
        .catch((err) => console.error(err))
  }



  fillData() {

    this.getSenseScoreData()
        .then((resp) => {
            let transformedData = this.transformData(resp);
            this.data.update(value => transformedData);
        })
        .catch((err) => console.error(err));

  }
  
  transformData(resp: any[]): SenseRange[] {
    let data: SenseRange[] = [];

    for(let item of resp) {
      data.push({
        kind: 'sense',
        id: item.id,
        level: item.level,
        min_score: item.min_score,
        max_score: item.max_score
      })
    }

    return data;
  }

  async getSenseScoreData(): Promise<any> {

    return await new Promise<void>((resolve, reject) => {

      fetch("http://localhost:8080/api/v1/sense-scores", {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'x-api-key': this.token
          }
      })
      .then((resp) => {

        resp.json()
            .then((json) => {

              resolve(json)


            })
            .catch((err) => reject(err))

      })
      .catch((err) => reject(err));

    });
  }

  async updatedSenseScoreScoreData(data: any): Promise<any> {
  
    return await new Promise<void>((resolve, reject) => {
  
      fetch("http://localhost:8080/api/v1/sense-scores", {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'x-api-key': this.token
          },
          body: JSON.stringify(data)
      })
      .then((resp) => {

        resp.json()
            .then((json) => {
              resolve(json)
            })
            .catch((err) => reject(err))

      })
      .catch((err) => reject(err));
  
    });
  }


}

function isSenseRange(x: Editable | null): x is SenseRange {
  return !!x && x.kind === 'sense';
}