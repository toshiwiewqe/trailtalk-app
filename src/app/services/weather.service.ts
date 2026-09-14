import { Injectable, signal } from '@angular/core';

export interface WeatherAlert {
  temp: number;
  condition: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly _current = signal<WeatherAlert>({
    temp: 22,
    condition: 'Weather Alert: Cordillera',
    message: 'Clear skies expected for the next 48h. Perfect for Mt. Ulap.',
  });

  readonly current = this._current.asReadonly();
}
